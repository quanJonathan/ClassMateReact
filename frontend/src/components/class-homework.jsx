import { AssignmentIndOutlined, AssignmentOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Paper,
  Select,
  Typography,
  Box,
  Icon,
  AccordionActions,
} from "@mui/material";
import { useState } from "react";
import { format } from "date-fns";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate, useParams } from "react-router-dom";

import { useIsTeacher } from "../helpers/getCurrentRole";

const CourseCardMini = ({ id, text, index, moveCard }) => {
  const [, ref] = useDrag({
    type: "CARD",
    homework: { id, index },
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover: (draggedhomework) => {
      if (draggedhomework.index !== index) {
        moveCard(draggedhomework.index, index);
        draggedhomework.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ marginBottom: 8 }}>
      <Paper sx={{ padding: 2 }}>{text}</Paper>
    </div>
  );
};

const DraggableContent = () => {
  const [category, setCategory] = useState("all");
  const [cards, setCards] = useState([
    { id: 1, text: "Card 1" },
    { id: 2, text: "Card 2" },
    { id: 3, text: "Card 3" },
  ]);

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  const filteredCards =
    category === "all"
      ? cards
      : cards.filter((card) => card.category === category);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ display: "flex", alignhomeworks: "center" }}>
          <Button variant="contained" color="primary">
            {}
          </Button>

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ marginLeft: 16 }}
          >
            <Menuhomework value="all">All</Menuhomework>
            <Menuhomework value="category1">Category 1</Menuhomework>
            <Menuhomework value="category2">Category 2</Menuhomework>
          </Select>
        </div>

        <div>
          {filteredCards.map((card, index) => (
            <CourseCardMini
              key={card.id}
              id={card.id}
              text={card.text}
              index={index}
              moveCard={moveCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export const ClassHomeWork = ({ homeworks }) => {
  console.log(homeworks);
  const navigate = useNavigate();
  const { id } = useParams();

  const isTeacher = useIsTeacher(id);

  return (
    <Box sx={{ px: 15 }}>
      {isTeacher ? (
        <Button variant="contained" sx={{ backgroundColor: "black" }}>
          Create homework
        </Button>
      ) : (
        <Button
          variant="text"
          sx={{ minHeight: 0 }}
          onClick={() => navigate(`/c/${id}/a/all`)}
        >
          <Icon sx={{ verticalAlign: "middle" }}>
            <AssignmentIndOutlined />
          </Icon>
          View your homeworks
        </Button>
      )}
      <Box sx={{ py: 4 }}>
        {homeworks?.map((homework, index) => (
          <Accordion
            elevation={1}
            square
            key={homework._id}
          >
            <AccordionSummary
              aria-controls={`panel-${homework._id}-content`}
              id={`panel-${homework._id}-header`}
              sx={{ p: 1, mb: 0, backgroundColor: "#fff" }}
            >
              <Icon sx={{ ml: 3, mr: 2 }}>
                <AssignmentOutlined />
              </Icon>
              <Typography
                sx={{ flexShrink: 0, width: "40%", fontWeight: "500" }}
              >
                {homework?.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{
                  flexShrink: 0,
                  width: "30%",
                  fontWeight: "400",
                  flexGrow: 1,
                }}
              >
                {homework?.composition?.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: "400" }}
              >
                {homework?.deadline == ""
                  ? "No deadline"
                  : "Due at " + format(homework?.deadline, "HH:mm yyyy-MM-dd")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{homework?.name}</Typography>
            </AccordionDetails>
            <AccordionActions sx={{ justifyContent: "flex-start" }}>
              <Divider />
              <Button
                variant="text"
                onClick={() => navigate(`/c/${id}/a/${homework?._id}/details`)}
              >
                View details
              </Button>
            </AccordionActions>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};
