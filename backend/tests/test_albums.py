import io

from PIL import Image


def _setup_user_and_template(client, db):
    """Create admin, size, template, pricing, and return regular user headers + template_size_id."""
    # Create admin
    client.post("/api/v1/auth/register", json={
        "email": "admin@test.com", "password": "pass123", "full_name": "Admin",
    })
    from app.models.user import User
    user = db.query(User).first()
    user.is_admin = True
    db.commit()

    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@test.com", "password": "pass123",
    })
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    # Create size + template + pricing
    size = client.post("/api/v1/admin/sizes", json={
        "label": "8x8", "width_inches": 8, "height_inches": 8,
    }, headers=admin_headers).json()

    template = client.post("/api/v1/admin/templates", json={
        "name": "Test Template", "theme": "wedding", "pages_count": 10, "photos_per_page": 2,
    }, headers=admin_headers).json()

    ts = client.post("/api/v1/admin/template-sizes", json={
        "template_id": template["id"], "size_id": size["id"], "price": 999,
    }, headers=admin_headers).json()

    # Create regular user
    client.post("/api/v1/auth/register", json={
        "email": "user@test.com", "password": "pass123", "full_name": "User",
    })
    user_login = client.post("/api/v1/auth/login", json={
        "email": "user@test.com", "password": "pass123",
    })
    user_headers = {"Authorization": f"Bearer {user_login.json()['access_token']}"}

    return user_headers, ts["id"]


def _make_test_image():
    """Create a small test image in memory."""
    img = Image.new("RGB", (100, 100), color="red")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf


def test_create_album(client, db):
    headers, ts_id = _setup_user_and_template(client, db)
    response = client.post("/api/v1/albums", json={
        "template_size_id": ts_id, "title": "My Wedding Album",
    }, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "My Wedding Album"
    assert data["status"] == "draft"
    assert data["template_size"]["template"]["name"] == "Test Template"


def test_list_albums(client, db):
    headers, ts_id = _setup_user_and_template(client, db)
    client.post("/api/v1/albums", json={
        "template_size_id": ts_id, "title": "Album 1",
    }, headers=headers)
    response = client.get("/api/v1/albums", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_upload_photo(client, db):
    headers, ts_id = _setup_user_and_template(client, db)
    album = client.post("/api/v1/albums", json={
        "template_size_id": ts_id, "title": "Photo Album",
    }, headers=headers).json()

    img = _make_test_image()
    response = client.post(
        f"/api/v1/albums/{album['id']}/photos",
        files={"file": ("test.jpg", img, "image/jpeg")},
        data={"page_number": "1", "position": "0"},
        headers=headers,
    )
    assert response.status_code == 201
    assert response.json()["page_number"] == 1


def test_complete_album(client, db):
    headers, ts_id = _setup_user_and_template(client, db)
    album = client.post("/api/v1/albums", json={
        "template_size_id": ts_id, "title": "Complete Me",
    }, headers=headers).json()

    # Upload a photo first
    img = _make_test_image()
    client.post(
        f"/api/v1/albums/{album['id']}/photos",
        files={"file": ("test.jpg", img, "image/jpeg")},
        data={"page_number": "1", "position": "0"},
        headers=headers,
    )

    response = client.put(f"/api/v1/albums/{album['id']}/complete", headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "completed"


def test_delete_photo(client, db):
    headers, ts_id = _setup_user_and_template(client, db)
    album = client.post("/api/v1/albums", json={
        "template_size_id": ts_id, "title": "Delete Photo",
    }, headers=headers).json()

    img = _make_test_image()
    photo = client.post(
        f"/api/v1/albums/{album['id']}/photos",
        files={"file": ("test.jpg", img, "image/jpeg")},
        data={"page_number": "1", "position": "0"},
        headers=headers,
    ).json()

    response = client.delete(
        f"/api/v1/albums/{album['id']}/photos/{photo['id']}",
        headers=headers,
    )
    assert response.status_code == 204
