import pytest


def calculate_attendance_percentage(attended: int, total: int) -> float:
    """Calculates attendance percentage according to Karunya University formula."""
    if total <= 0:
        return 100.0
    return round((attended / total) * 100, 2)


def is_examination_eligible(percentage: float, minimum_threshold: float = 75.0) -> bool:
    """Determines whether a student satisfies the examination eligibility threshold."""
    return percentage >= minimum_threshold


def calculate_hostel_compliance_rate(
    present_days: int, outpass_days: int, total_days: int
) -> float:
    """
    Hostel roll-call compliance rate recognizes physically present days
    plus authorized outpass days as compliant residence.
    """
    if total_days <= 0:
        return 100.0
    return round(((present_days + outpass_days) / total_days) * 100, 2)


class TestAttendanceCalculations:
    def test_standard_attendance_percentages(self):
        assert calculate_attendance_percentage(99, 100) == 99.0
        assert calculate_attendance_percentage(45, 60) == 75.0
        assert calculate_attendance_percentage(44, 60) == 73.33
        assert calculate_attendance_percentage(0, 0) == 100.0
        assert calculate_attendance_percentage(0, 20) == 0.0

    def test_examination_eligibility_threshold(self):
        assert is_examination_eligible(75.0) is True
        assert is_examination_eligible(75.01) is True
        assert is_examination_eligible(92.5) is True
        assert is_examination_eligible(74.99) is False
        assert is_examination_eligible(60.0) is False

    def test_hostel_roll_call_compliance_formula(self):
        # 26 days physically in hostel + 4 authorized outpasses out of 30 total recorded days
        compliance = calculate_hostel_compliance_rate(
            present_days=26, outpass_days=4, total_days=30
        )
        assert compliance == 100.0

        # 20 present + 2 outpass out of 25 days -> 88.0%
        partial_compliance = calculate_hostel_compliance_rate(
            present_days=20, outpass_days=2, total_days=25
        )
        assert partial_compliance == 88.0

    def test_rounding_precision(self):
        # 1/3 = 33.3333... -> rounded to 33.33
        assert calculate_attendance_percentage(1, 3) == 33.33
        # 2/3 = 66.6666... -> rounded to 66.67
        assert calculate_attendance_percentage(2, 3) == 66.67

