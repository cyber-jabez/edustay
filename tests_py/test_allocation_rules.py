from dataclasses import dataclass
from typing import List, Optional
import pytest


@dataclass
class Room:
    id: str
    room_number: str
    capacity: int
    gender_category: str
    occupied_beds: int = 0

    @property
    def is_available(self) -> bool:
        return self.occupied_beds < self.capacity

    @property
    def remaining_capacity(self) -> int:
        return max(0, self.capacity - self.occupied_beds)


@dataclass
class RoommateRequest:
    from_student_id: str
    to_student_id: str


def can_assign_student_to_room(student_gender: str, room: Room) -> bool:
    if student_gender.upper() != room.gender_category.upper():
        return False
    return room.is_available


def is_mutual_roommate_match(
    student_a_id: str,
    student_b_id: str,
    requests: List[RoommateRequest],
) -> bool:
    """
    Mutual roommate pairing requires:
    Student A selected Student B AND Student B selected Student A.
    """
    a_requested_b = any(
        r.from_student_id == student_a_id and r.to_student_id == student_b_id
        for r in requests
    )
    b_requested_a = any(
        r.from_student_id == student_b_id and r.to_student_id == student_a_id
        for r in requests
    )
    return a_requested_b and b_requested_a


class TestRoomAllocationConstraints:
    def test_room_capacity_limits(self):
        double_room = Room(id="r1", room_number="101", capacity=2, gender_category="MALE", occupied_beds=1)
        assert double_room.is_available is True
        assert double_room.remaining_capacity == 1

        # Fill the second bed
        double_room.occupied_beds = 2
        assert double_room.is_available is False
        assert double_room.remaining_capacity == 0

    def test_gender_hostel_segregation(self):
        male_room = Room(id="r_male", room_number="201", capacity=4, gender_category="MALE")
        female_room = Room(id="r_female", room_number="301", capacity=4, gender_category="FEMALE")

        assert can_assign_student_to_room("MALE", male_room) is True
        assert can_assign_student_to_room("FEMALE", male_room) is False

        assert can_assign_student_to_room("FEMALE", female_room) is True
        assert can_assign_student_to_room("MALE", female_room) is False

    def test_mutual_roommate_pairing_symmetry(self):
        reqs = [
            RoommateRequest(from_student_id="URK25CS6015", to_student_id="URK25CS6016"),
            RoommateRequest(from_student_id="URK25CS6016", to_student_id="URK25CS6015"),
            RoommateRequest(from_student_id="URK25CS6017", to_student_id="URK25CS6015"),
        ]

        # 6015 and 6016 mutually picked each other
        assert is_mutual_roommate_match("URK25CS6015", "URK25CS6016", reqs) is True

        # 6017 picked 6015, but 6015 did NOT pick 6017 -> asymmetric, not matched
        assert is_mutual_roommate_match("URK25CS6015", "URK25CS6017", reqs) is False

