from app.models.template import AlbumTemplate, AlbumSize, TemplateSize
from app.models.album import Album


def _setup_user_and_album(client, db):
    """Create user, template, size, template_size, and a completed album."""
    client.post("/api/v1/auth/register", json={
        "email": "cart@example.com", "password": "password123", "full_name": "Cart User",
    })
    login = client.post("/api/v1/auth/login", json={
        "email": "cart@example.com", "password": "password123"})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get user ID
    me = client.get("/api/v1/auth/me", headers=headers)
    user_id = me.json()["id"]

    # Create template and size directly in DB
    template = AlbumTemplate(name="Wedding", description="Wedding album", theme="wedding")
    db.add(template)
    db.flush()

    size = AlbumSize(label="A4", width_inches=8.3, height_inches=11.7)
    db.add(size)
    db.flush()

    ts = TemplateSize(template_id=template.id, size_id=size.id, price=999.00)
    db.add(ts)
    db.flush()

    # Create a completed album
    album = Album(user_id=user_id, template_size_id=ts.id, title="My Wedding", status="completed")
    db.add(album)
    db.commit()
    db.refresh(album)

    return token, headers, album


def test_get_empty_cart(client, db):
    token, headers, _ = _setup_user_and_album(client, db)
    res = client.get("/api/v1/cart/", headers=headers)
    assert res.status_code == 200
    assert res.json()["items"] == []


def test_add_to_cart(client, db):
    token, headers, album = _setup_user_and_album(client, db)
    res = client.post("/api/v1/cart/items", json={
        "album_id": album.id, "quantity": 2,
    }, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2


def test_update_cart_item(client, db):
    token, headers, album = _setup_user_and_album(client, db)
    cart_res = client.post("/api/v1/cart/items", json={
        "album_id": album.id, "quantity": 1,
    }, headers=headers)
    item_id = cart_res.json()["items"][0]["id"]
    res = client.put(f"/api/v1/cart/items/{item_id}", json={
        "quantity": 5,
    }, headers=headers)
    assert res.status_code == 200
    assert res.json()["items"][0]["quantity"] == 5


def test_remove_cart_item(client, db):
    token, headers, album = _setup_user_and_album(client, db)
    cart_res = client.post("/api/v1/cart/items", json={
        "album_id": album.id, "quantity": 1,
    }, headers=headers)
    item_id = cart_res.json()["items"][0]["id"]
    res = client.delete(f"/api/v1/cart/items/{item_id}", headers=headers)
    assert res.status_code == 204


def test_clear_cart(client, db):
    token, headers, album = _setup_user_and_album(client, db)
    client.post("/api/v1/cart/items", json={
        "album_id": album.id, "quantity": 1,
    }, headers=headers)
    res = client.delete("/api/v1/cart/", headers=headers)
    assert res.status_code == 204


def test_add_draft_album_to_cart_fails(client, db):
    """Cannot add a draft album to cart."""
    token, headers, album = _setup_user_and_album(client, db)
    # Set album back to draft
    album.status = "draft"
    db.commit()
    res = client.post("/api/v1/cart/items", json={
        "album_id": album.id, "quantity": 1,
    }, headers=headers)
    assert res.status_code == 400
