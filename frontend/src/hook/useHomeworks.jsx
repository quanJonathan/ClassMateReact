import axios from "axios";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { useAuth } from "./useAuth";

const calculateTotalScore = (member, homeworks, compositions) => {
  let result = 0;
  // console.log(compositions)
  compositions?.map((c, index) => {
    let temp = 0;
    const foundHomeworks = homeworks.filter((h) => h.composition._id == c._id);
    //console.log("homework of composition " + c.name + "for " +  member?.studentId)
    //console.log("grade scale " +  c.gradeScale)
    //console.log(foundHomeworks)
    foundHomeworks.map((h) => {
      const foundUser = h.doneMembers.find((h) => h.memberId == member._id);
      if (foundUser && foundUser.state == "final") {
        //console.log("score for homework " + foundUser.score)
        temp = temp + foundUser.score / h.maxScore;
      }
    });

    //console.log(temp)
    
    //console.log(foundHomeworks?.length)

    //console.log("currentScore for " + member?.studentId)
    //console.log(temp)
    if(foundHomeworks.length != 0){
      result = result + (temp / foundHomeworks.length) * c.gradeScale / 100;
    }

    //console.log("total score "+  result );
  });

  return {
    _id: "total_score_" + member._id,
    score: result.toFixed(2)*100,
  }
};

export function useHomeworks(members, homeworks, compositions) {
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

  // console.log(members)

  let headers = [
    {
      sortingField: true,
      align: "justify",
      totalScore: {
        label: "Total score",
        id: "total_scoring_field",
      }
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
      composition: homework.composition,
      minWidth: 170,
      align: "left",
    };
    headers.push(header);
  });

  rows = members?.map((member) => {
    const { doneHomework } = homeworks.reduce(
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
          acc.doneHomework.push({
            score: "",
            state: "pending",
            maxScore: homework.maxScore,
            _id: homework._id,
          });
        }

        return acc;
      },
      { doneHomework: [], notDoneHomework: [] }
    );

    const allHomeworks = [...doneHomework];

    const totalScore = calculateTotalScore(member, homeworks, compositions)
    // console.log(totalScore)
    //console.log(member)
    return { user: member, totalScore: totalScore, align: "center", homeworks: allHomeworks };
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
