import { useAuth } from "../hook/useAuth"

export function useIsTeacher(id) {
    const {user} = useAuth()
    const currentClass = user?.classes.filter(
        (classObject) => classObject.classId._id == id
      );
    const currentRole = currentClass[0]?.role;

    if(currentRole)
      return currentRole == '3000'

    return false
}
