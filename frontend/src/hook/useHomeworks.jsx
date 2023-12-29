import axios from "axios";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "./useAuth";

export function useHomeworks(members, homeworks) {
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

  // console.log(homeworks);

  let headers = [
    {
      sortingField: true,
      align: "",
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
      align: "left",
    };
    headers.push(header);
  });

  rows = members?.map((member) => {
    const { doneHomework, notDoneHomework } = homeworks.reduce(
      (acc, homework) => {
        const doneMember = homework.doneMembers.find(
          (doneMember) => doneMember.memberId === member._id
        );

        if (doneMember) {
          
          acc.doneHomework.push({
            score: doneMember.score || 0,
            state: doneMember.state || "pending",
            maxScore: homework.maxScore,
            _id: homework._id,
          });
        } else {

          // acc.notDoneHomework.push({
          //   score: 0,
          //   state: "pending",
          //   maxScore: homework.maxScore,
          //   _id: homework._id,
          // });
          acc.doneHomework.push({
            score: '',
            state: "pending",
            maxScore: homework.maxScore,
            _id: homework._id,
          });
        }

        return acc;
      },
      { doneHomework: [], notDoneHomework: [] }
    );

    // const allHomeworks = [...doneHomework, ...notDoneHomework]
    //   .slice()
    //   .sort((a, b) => {
    //     homeworks.findIndex((h) => h._id === a._id) -
    //       homeworks.findIndex((h) => h._id === b._id);
    //   });
      const allHomeworks = [...doneHomework];

      //console.log(member)
    return { user: member, align: "center", homeworks: allHomeworks };
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
