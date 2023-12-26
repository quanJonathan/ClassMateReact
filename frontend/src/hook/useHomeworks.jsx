import axios from "axios";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "./useAuth";

export function useHomeworks( members, homeworks) {
  // const { token } = useAuth();
  // const fetcher = (url) =>
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: "Bearer " + token?.refreshToken,
  //       },
  //     })
  //     .then((res) => res.data);
  // const { id } = useParams();
  // const { data, isLoading, error } = useSWR(
  //   `http://localhost:3001/class/getHomeworks/${id}`,
  //   fetcher
  // );

  //   console.log(useParams())
  // console.log(data);

  console.log(homeworks)

  let headers = [
    {
      sortingField: true,
    },
  ];

  let rows = [];
  homeworks?.map((homework) => {
    const header = {
      sortingField: false,
      id: homework._id,
      label: homework.name,
      deadline: homework.deadline,
      totalScore: homework.maxScore,
      minWidth: 170,
      align: "center",
    };
    headers.push(header);
  });

  rows = members?.map((member) => {
    const memberHomework = homeworks
      .filter((homework) =>
        homework.doneMembers.some((doneMember) => doneMember.memberId === member._id)
      )
      ?.map((homework) => ({
        score:
          homework.doneMembers.find(
            (doneMember) => doneMember.memberId === member._id
          )?.score || 0,
        state:
          homework.doneMembers.find(
            (doneMember) => doneMember.memberId === member._id
          )?.state || "pending",
        maxScore:
            homework.maxScore,
        _id: homework._id
      }));

    return { user: member, align: 'left', homeworks: memberHomework };
  });
  
  // rows.forEach((row) =>{
  //     console.log(row.homework)
  // })
  // console.log("rows")
  // console.log(rows)

  // console.log("headers")
  // console.log(headers)

  return {
    headers: headers,
    rows: rows,
  };
}
