from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_views: int
    total_students: int
    total_submissions: int
    total_feedback: int
