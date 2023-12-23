import { Button, MenuItem, Paper, Select, Typography } from "@mui/material"
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';

const CourseCardMini = ({ id, text, index, moveCard }) => {
  const [, ref] = useDrag({
    type: 'CARD',
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} style={{ marginBottom: 8 }}>
      <Paper sx={{ padding: 2 }}>{text}</Paper>
    </div>
  );
};


export const ClassHomeWork = (props) => {
  const [category, setCategory] = useState('all');
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1' },
    { id: 2, text: 'Card 2' },
    { id: 3, text: 'Card 3' },
  ]);

  const moveCard = (fromIndex, toIndex) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  const filteredCards =
    category === 'all' ? cards : cards.filter((card) => card.category === category);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" color="primary">
            My Button
          </Button>

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ marginLeft: 16 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="category1">Category 1</MenuItem>
            <MenuItem value="category2">Category 2</MenuItem>
          </Select>
        </div>

        <div>
          {filteredCards.map((card, index) => (
            <CourseCardMini key={card.id} id={card.id} text={card.text} index={index} moveCard={moveCard} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}