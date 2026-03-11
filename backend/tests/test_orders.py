from app.models.template import AlbumTemplate, AlbumSize, TemplateSize
from app.models.album import Album
from app.models.address import Address


def _setup_full(client, db):
    """Create user, template, size, completed album, address, and add to cart."""
    client.post("/api/v1/auth/register", json={
        "email": "order@example.com", "password": "password123", "full_name": "Order User",
    })
    login = client.post("/api/v1/auth/login", json={
        "email": "order@example.com", "password": "password123"})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me = client.get("/api/v1/auth/me", headers=headers)
    user_id = me.json()["id"]

    template = AlbumTemplate(name="Baby", description="Baby album", theme="baby")
    db.add(template)
    db.flush()
    size = AlbumSize(label="A5", width_inches=5.8, height_inches=8.3)
    db.add(size)
    db.flush()
    ts = TemplateSize(template_id=template.id, size_id=size.id, price=599.00)
    db.add(ts)
    db.flush()
    album = Album(user_id=user_id, template_size_id=ts.id, title="My Baby", status="completed")
    db.add(album)
    db.flush()
    address = Address(
        user_id=user_id, full_name="Order User", phone="9876543210",
        address_line1="123 Main St", city="Chennai", state="Tamil Nadu", pincode="600001",
    )
    db.add(address)
    db.commit()
    db.refresh(album)
    db.refresh(address)

    # Add to cart
    client.post("/api/v1/cart/items", json={"album_id": album.id, "quantity": 2}, headers=headers)

    return token, headers, album, address


def test_create_order(client, db):
    token, headers, album, address = _setup_full(client, db)
    res = client.post("/api/v1/orders/", json={
        "address_id": address.id,
    }, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "pending"
    assert len(data["items"]) == 1
    assert float(data["total_amount"]) == 1198.00


def test_list_orders(client, db):
    token, headers, album, address = _setup_full(client, db)
    client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    res = client.get("/api/v1/orders/", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_order_detail(client, db):
    token, headers, album, address = _setup_full(client, db)
    order_res = client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    order_id = order_res.json()["id"]
    res = client.get(f"/api/v1/orders/{order_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["id"] == order_id


def test_order_clears_cart(client, db):
    token, headers, album, address = _setup_full(client, db)
    client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    cart_res = client.get("/api/v1/cart/", headers=headers)
    assert cart_res.json()["items"] == []


def test_order_empty_cart_fails(client, db):
    token, headers, album, address = _setup_full(client, db)
    # Create first order (clears cart)
    client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    # Try again with empty cart
    res = client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    assert res.status_code == 400


def test_payment_flow(client, db):
    token, headers, album, address = _setup_full(client, db)
    order_res = client.post("/api/v1/orders/", json={"address_id": address.id}, headers=headers)
    order_id = order_res.json()["id"]

    # Create payment
    pay_res = client.post("/api/v1/payments/create", json={"order_id": order_id}, headers=headers)
    assert pay_res.status_code == 200
    assert "razorpay_order_id" in pay_res.json()

    # Verify payment
    verify_res = client.post("/api/v1/payments/verify", json={
        "order_id": order_id,
        "razorpay_payment_id": "pay_test123",
        "razorpay_order_id": pay_res.json()["razorpay_order_id"],
        "razorpay_signature": "sig_test123",
    })
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "success"

    # Verify order status changed to paid
    order_detail = client.get(f"/api/v1/orders/{order_id}", headers=headers)
    assert order_detail.json()["status"] == "paid"
