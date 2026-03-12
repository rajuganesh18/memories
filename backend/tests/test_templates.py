def _create_admin(client):
    """Register a user and make them admin, return auth header."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@example.com",
            "password": "password123",
            "full_name": "Admin User",
        },
    )
    # Make user admin directly in DB via the test
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "password123"},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _make_admin(db):
    """Set the first user as admin."""
    from app.models.user import User
    user = db.query(User).first()
    user.is_admin = True
    db.commit()


def test_admin_create_size(client, db):
    headers = _create_admin(client)
    _make_admin(db)
    response = client.post(
        "/api/v1/admin/sizes",
        json={"label": "8x8 inches", "width_inches": 8.0, "height_inches": 8.0},
        headers=headers,
    )
    assert response.status_code == 201
    assert response.json()["label"] == "8x8 inches"


def test_admin_create_template(client, db):
    headers = _create_admin(client)
    _make_admin(db)
    response = client.post(
        "/api/v1/admin/templates",
        json={
            "name": "Classic Wedding",
            "description": "Elegant wedding album",
            "theme": "wedding",
            "photos_required": 24,
        },
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Classic Wedding"
    assert data["theme"] == "wedding"


def test_admin_create_template_size_pricing(client, db):
    headers = _create_admin(client)
    _make_admin(db)

    # Create size
    size_res = client.post(
        "/api/v1/admin/sizes",
        json={"label": "10x10 inches", "width_inches": 10.0, "height_inches": 10.0},
        headers=headers,
    )
    size_id = size_res.json()["id"]

    # Create template
    tmpl_res = client.post(
        "/api/v1/admin/templates",
        json={"name": "Travel Adventure", "theme": "travel", "photos_required": 20},
        headers=headers,
    )
    template_id = tmpl_res.json()["id"]

    # Set pricing
    pricing_res = client.post(
        "/api/v1/admin/template-sizes",
        json={"template_id": template_id, "size_id": size_id, "price": 1499.00},
        headers=headers,
    )
    assert pricing_res.status_code == 201


def test_list_templates_public(client, db):
    headers = _create_admin(client)
    _make_admin(db)

    # Create a template
    client.post(
        "/api/v1/admin/templates",
        json={"name": "Baby Memories", "theme": "baby", "photos_required": 16},
        headers=headers,
    )

    # Public listing (no auth needed)
    response = client.get("/api/v1/templates")
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_get_template_detail(client, db):
    headers = _create_admin(client)
    _make_admin(db)

    # Create template + size + pricing
    tmpl_res = client.post(
        "/api/v1/admin/templates",
        json={"name": "Graduation", "theme": "graduation"},
        headers=headers,
    )
    template_id = tmpl_res.json()["id"]

    size_res = client.post(
        "/api/v1/admin/sizes",
        json={"label": "12x12 inches", "width_inches": 12.0, "height_inches": 12.0},
        headers=headers,
    )
    size_id = size_res.json()["id"]

    client.post(
        "/api/v1/admin/template-sizes",
        json={"template_id": template_id, "size_id": size_id, "price": 1999.00},
        headers=headers,
    )

    # Get detail
    response = client.get(f"/api/v1/templates/{template_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Graduation"
    assert len(data["template_sizes"]) == 1
    assert float(data["template_sizes"][0]["price"]) == 1999.00


def test_filter_templates_by_theme(client, db):
    headers = _create_admin(client)
    _make_admin(db)

    client.post(
        "/api/v1/admin/templates",
        json={"name": "Wedding A", "theme": "wedding"},
        headers=headers,
    )
    client.post(
        "/api/v1/admin/templates",
        json={"name": "Travel B", "theme": "travel"},
        headers=headers,
    )

    response = client.get("/api/v1/templates?theme=wedding")
    assert response.status_code == 200
    for t in response.json():
        assert t["theme"] == "wedding"


def test_non_admin_cannot_create_template(client):
    # Register normal user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "user@example.com",
            "password": "password123",
            "full_name": "Normal User",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "password123"},
    )
    token = login_res.json()["access_token"]

    response = client.post(
        "/api/v1/admin/templates",
        json={"name": "Unauthorized", "theme": "wedding"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
