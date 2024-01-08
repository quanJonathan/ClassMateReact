import { useAuth } from "../hook/useAuth"

export function useIsTeacher(id) {
    const {user} = useAuth()
    const currentClass = user?.classes.find(
        (classObject) => classObject.classId._id == id
      );

    if(currentClass)
      return currentClass.role == '3000'

    return false
}
