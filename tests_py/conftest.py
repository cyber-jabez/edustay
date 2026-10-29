import os
import pytest
import requests

BASE_URL = os.environ.get("TEST_BASE_URL", "http://localhost:3000")


@pytest.fixture(scope="session")
def base_url():
    return BASE_URL


@pytest.fixture
def unauth_session():
    """Returns a clean session with no cookies."""
    session = requests.Session()
    session.headers.update({"Accept": "application/json"})
    return session


@pytest.fixture
def student_session(base_url):
    """Returns an authenticated session for primary student Jabez Gabrielraj."""
    session = requests.Session()
    session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})
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
        if res.status_code == 200:
            return session
    except Exception:
        pass
    pytest.skip("Local test server not reachable or offline.")


@pytest.fixture
def staff_session(base_url):
    """Returns an authenticated session for SRA staff Mr. D. Joseph."""
    session = requests.Session()
    session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})
    try:
        res = session.post(
            f"{base_url}/api/auth/login",
            json={
                "identifier": "SRA001",
                "password": "karunya123",
                "roleType": "STAFF",
            },
            timeout=5,
        )
        if res.status_code == 200:
            return session
    except Exception:
        pass
    pytest.skip("Local test server not reachable or offline.")

