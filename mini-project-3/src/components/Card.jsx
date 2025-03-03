import React from "react";

function Card({ binary, octal, hexadecimal, decimal, customBase, onDelete }) {
  return (
    <div className="card">
      <h2>Digital Keypad:</h2>
      <p><strong>Binary:</strong> {binary}</p>
      <p><strong>Octal:</strong> {octal}</p>
      <p><strong>Hexadecimal:</strong> {hexadecimal}</p>
      <p><strong>Decimal:</strong> {decimal}</p>
      <p><strong>Custom Base:</strong> {customBase}</p>
      {/* <button onClick={onDelete} className="delete-button">Delete</button> */}
    </div>
  );
}

export default Card;
