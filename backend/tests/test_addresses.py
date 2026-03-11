def _register_and_login(client):
    client.post("/api/v1/auth/register", json={
        "email": "addr@example.com", "password": "password123", "full_name": "Addr User",
    })
    res = client.post("/api/v1/auth/login", json={"email": "addr@example.com", "password": "password123"})
    return res.json()["access_token"]


def _headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_create_address(client):
    token = _register_and_login(client)
    res = client.post("/api/v1/addresses/", json={
        "full_name": "John", "phone": "9876543210",
        "address_line1": "123 Main St", "city": "Chennai",
        "state": "Tamil Nadu", "pincode": "600001", "is_default": True,
    }, headers=_headers(token))
    assert res.status_code == 201
    data = res.json()
    assert data["full_name"] == "John"
    assert data["is_default"] is True


def test_list_addresses(client):
    token = _register_and_login(client)
    client.post("/api/v1/addresses/", json={
        "full_name": "A1", "phone": "111", "address_line1": "St1",
        "city": "C1", "state": "S1", "pincode": "100001",
    }, headers=_headers(token))
    client.post("/api/v1/addresses/", json={
        "full_name": "A2", "phone": "222", "address_line1": "St2",
        "city": "C2", "state": "S2", "pincode": "200002",
    }, headers=_headers(token))
    res = client.get("/api/v1/addresses/", headers=_headers(token))
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_update_address(client):
    token = _register_and_login(client)
    create_res = client.post("/api/v1/addresses/", json={
        "full_name": "Old", "phone": "111", "address_line1": "St",
        "city": "C", "state": "S", "pincode": "100001",
    }, headers=_headers(token))
    addr_id = create_res.json()["id"]
    res = client.put(f"/api/v1/addresses/{addr_id}", json={
        "full_name": "New", "phone": "222", "address_line1": "St2",
        "city": "C2", "state": "S2", "pincode": "200002",
    }, headers=_headers(token))
    assert res.status_code == 200
    assert res.json()["full_name"] == "New"


def test_delete_address(client):
    token = _register_and_login(client)
    create_res = client.post("/api/v1/addresses/", json={
        "full_name": "Del", "phone": "111", "address_line1": "St",
        "city": "C", "state": "S", "pincode": "100001",
    }, headers=_headers(token))
    addr_id = create_res.json()["id"]
    res = client.delete(f"/api/v1/addresses/{addr_id}", headers=_headers(token))
    assert res.status_code == 204


def test_address_requires_auth(client):
    res = client.get("/api/v1/addresses/")
    assert res.status_code in (401, 403)
