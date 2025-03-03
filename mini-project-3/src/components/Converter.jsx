import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CommonConversions from "./CommonConversions";

function Converter() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("0");
  const [savedCards, setSavedCards] = useState([]);

  const adjustValue = (amount) => {
    setInputValue((prev) => (parseFloat(prev) || 0) + amount);
  };

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversions"
        );
        console.log("Fetched conversions:", response.data); // Debugging line
        setSavedCards(response.data);
      } catch (error) {
        console.error("Error fetching conversions:", error);
      }
    };
    fetchConversions();
  }, []);

  const convert = async () => {
    const number = parseFloat(inputValue);
    if (isNaN(number)) {
      alert("Please enter a valid number.");
      return;
    }

    const newResult = {
      input: number.toString(),
      binary: number.toString(2),
      octal: number.toString(8),
      decimal: number.toString(10),
      hexadecimal: number.toString(16).toUpperCase(),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/conversions/save",
        newResult
      );
      setSavedCards((prev) => [...prev, response.data.conversion]);
    } catch (error) {
      console.error("Error saving conversion:", error);
    }
  };

  const deleteCard = async (id) => {
    try {
      console.log("Deleting card with ID:", id);
      await axios.delete(`http://localhost:5000/api/conversions/${id}`);
      console.log("Deleted successfully!");
      console.log(id);

      const response = await axios.get("http://localhost:5000/api/conversions");
      setSavedCards(response.data);
    } catch (error) {
      console.error("Error deleting conversion:", error);
    }
  };

  // Drag & Drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = savedCards.findIndex((card) => card._id === active.id);
      const newIndex = savedCards.findIndex((card) => card._id === over.id);
      setSavedCards((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Digital Keypad:</h1>
      <input
        type="text"
        value={inputValue}
        placeholder="Enter a number"
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <button onClick={convert} style={styles.button}>
        Convert & Save Card
      </button>

      <div style={styles.adjustButtons}>
        <button onClick={() => adjustValue(5)} style={styles.adjustButton}>
          +5
        </button>
        <button onClick={() => adjustValue(-5)} style={styles.adjustButton}>
          -5
        </button>
        <button onClick={() => adjustValue(1)} style={styles.adjustButton}>
          +1
        </button>
        <button onClick={() => adjustValue(-1)} style={styles.adjustButton}>
          -1
        </button>
      </div>

      <h3 style={{ color: "black", fontSize: "1.5rem", fontWeight: "bold" }}>
        Saved Conversions (Drag & Reorder!):
      </h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={savedCards.map((card) => {
            console.log("Card in SortableContext:", card); // Debugging
            return card._id || "undefined-id";
          })}
          strategy={verticalListSortingStrategy}
        >
          <div style={styles.cardsContainer}>
            {savedCards.map((card) => (
              <SortableCard
                key={card._id || "undefined-id"}
                card={card}
                deleteCard={deleteCard}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <CommonConversions savedCards={savedCards} />
      <button
        onClick={() => navigate("/conversion-history")}
        style={styles.button}
      >
        View Conversion Graph 📈
      </button>
      <button onClick={() => navigate("/")} style={styles.button}>
        Back to HomePage
      </button>
    </div>
  );
}

function SortableCard({ card, deleteCard }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    console.log("Delete button clicked for card:", card._id);
    deleteCard(card._id);
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...styles.card,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p style={styles.cardText}>
        <strong>Number:</strong> {card.input}
      </p>
      <p style={styles.cardText}>
        <strong>Binary:</strong> {card.binary}
      </p>
      <p style={styles.cardText}>
        <strong>Octal:</strong> {card.octal}
      </p>
      <p style={styles.cardText}>
        <strong>Decimal:</strong> {card.decimal}
      </p>
      <p style={styles.cardText}>
        <strong>Hexadecimal:</strong> {card.hexadecimal}
      </p>
      <button
        onClick={handleDelete}
        style={styles.deleteButton}
      >
        Delete ❌
      </button>
    </div>
  );
}

// **Inline Styling**
const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fc",
    padding: "20px",
    minHeight: "100vh",
  },

  title: {
    fontSize: "2rem",
    color: "#3b82f6",
    marginBottom: "10px",
  },
  input: {
    width: "80%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  adjustButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  },
  adjustButton: {
    backgroundColor: "#b3e0f7",
    color: "#333",
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
  },
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "250px",
    textAlign: "center",
    cursor: "grab",
  },
  cardText: {
    color: "black",
    fontSize: "16px",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "white",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Converter;
