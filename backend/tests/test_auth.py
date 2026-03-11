def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User",
            "phone": "+919876543210",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data


def test_register_duplicate_email(client):
    user_data = {
        "email": "dup@example.com",
        "password": "password123",
        "full_name": "Dup User",
    }
    client.post("/api/v1/auth/register", json=user_data)
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 400


def test_login(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "password123",
            "full_name": "Login User",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrong@example.com",
            "password": "password123",
            "full_name": "Wrong User",
        },
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_get_me(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "me@example.com",
            "password": "password123",
            "full_name": "Me User",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "me@example.com", "password": "password123"},
    )
    token = login_res.json()["access_token"]
    response = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"


def test_refresh_token(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "refresh@example.com",
            "password": "password123",
            "full_name": "Refresh User",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "refresh@example.com", "password": "password123"},
    )
    refresh = login_res.json()["refresh_token"]
    response = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": refresh}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_update_me(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "update@example.com",
            "password": "password123",
            "full_name": "Old Name",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "update@example.com", "password": "password123"},
    )
    token = login_res.json()["access_token"]
    response = client.put(
        "/api/v1/auth/me",
        json={"full_name": "New Name"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "New Name"
