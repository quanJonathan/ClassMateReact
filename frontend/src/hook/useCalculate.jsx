import { useAuth } from "./useAuth";

export function useCalculate(homeworks, compositions) {
  const { user } = useAuth();
  let result = 0;
  compositions?.map((c) => {
    let temp = 0;
    const foundHomeworks = homeworks.filter((h) => h.composition._id == c._id);
    foundHomeworks.map((h) => {
      const foundUser = h.doneMembers.find((h) => h.memberId == user._id);
      if (foundUser && foundUser.state == "final") {
        temp = temp + foundUser.score / h.maxScore;
      }
    });

    result = result + temp * c.gradeScale;
  });

  return result;
}
