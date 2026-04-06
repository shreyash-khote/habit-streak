from fastapi import APIRouter
from schemas import GoalBreakdownRequest, GoalBreakdownResponse
from services.ai_coach import get_habit_suggestions_for_goal

router = APIRouter(prefix="/coach", tags=["coach"])

@router.post("/breakdown", response_model=GoalBreakdownResponse)
def generate_goal_breakdown(request: GoalBreakdownRequest):
    """Hits the OpenAI API to break a big goal into daily habits."""
    suggestion = get_habit_suggestions_for_goal(request.goal)
    return GoalBreakdownResponse(goal=request.goal, suggestion=suggestion)
