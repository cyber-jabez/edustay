import pytest
import requests


class TestApiIntegration:
    def test_unauthenticated_protected_api_access(self, unauth_session, base_url):
        """Verifies that accessing protected student API endpoints returns 401 Unauthorized."""
        try:
            res = unauth_session.get(f"{base_url}/api/auth/me", timeout=3)
            assert res.status_code == 401
            assert res.json().get("authenticated") is False
        except requests.exceptions.ConnectionError:
            pytest.skip("Test server offline or network restricted")

    def test_login_student_flow(self, base_url):
        """Tests successful authentication as a student."""
        session = requests.Session()
        try:
            res = session.post(
                f"{base_url}/api/auth/login",
                json={
                    "identifier": "URK25CS6015",
                    "password": "karunya123",
                    "roleType": "STUDENT",
                },
                timeout=5,
            )
            assert res.status_code == 200
            data = res.json()
            assert data["success"] is True
            assert data["user"]["identifier"] == "URK25CS6015"
            assert data["user"]["role"] == "STUDENT"
            assert data["redirectUrl"] == "/student/dashboard"
        except requests.exceptions.ConnectionError:
            pytest.skip("Test server offline or network restricted")

    def test_login_invalid_credentials_rejected(self, base_url):
        """Tests that invalid passwords are rejected with 401."""
        session = requests.Session()
        try:
            res = session.post(
                f"{base_url}/api/auth/login",
                json={
                    "identifier": "URK25CS6015",
                    "password": "wrong_password_999",
                    "roleType": "STUDENT",
                },
                timeout=5,
            )
            assert res.status_code == 401
            assert "Invalid credentials" in res.json().get("error", "")
        except requests.exceptions.ConnectionError:
            pytest.skip("Test server offline or network restricted")

    def test_authenticated_me_profile(self, student_session, base_url):
        """Tests that /api/auth/me returns the active logged in student details."""
        res = student_session.get(f"{base_url}/api/auth/me", timeout=5)
        assert res.status_code == 200
        data = res.json()
        assert data["authenticated"] is True
        assert data["user"]["identifier"] == "URK25CS6015"
        assert "fullName" in data["user"]
        assert "studentProfile" in data["user"]

    def test_notifications_endpoint(self, student_session, base_url):
        """Tests that /api/notifications returns user notifications list."""
        res = student_session.get(f"{base_url}/api/notifications", timeout=5)
        assert res.status_code == 200
        data = res.json()
        assert "notifications" in data
        assert "unreadCount" in data

    def test_logout_invalidates_session(self, base_url):
        """Tests that logging out clears the session."""
        session = requests.Session()
        try:
            # 1. Login
            session.post(
                f"{base_url}/api/auth/login",
                json={
                    "identifier": "URK25CS6015",
                    "password": "karunya123",
                    "roleType": "STUDENT",
                },
                timeout=5,
            )
            # 2. Logout
            logout_res = session.post(f"{base_url}/api/auth/logout", timeout=5)
            assert logout_res.status_code == 200

            # 3. Subsequent authenticated call should fail with 401
            me_res = session.get(f"{base_url}/api/auth/me", timeout=5)
            assert me_res.status_code == 401
        except requests.exceptions.ConnectionError:
            pytest.skip("Test server offline or network restricted")

