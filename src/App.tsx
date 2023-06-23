import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { FC, useState } from "react";

const result = ["CYCLING", " INSIDE", "    ELECTRICITY", "RECYCLING"];
const colors = ["#4287f5", "#42f56f", "#f2f542"];

const getLetter = (h: number, w: number): string => {
  if (result.length < h) {
    return "";
  }
  const word = result[h];
  if (word.length < w) {
    return "";
  }
  return word[w];
};

const isSameLetter = (h: number, w: number): "forward" | "backward" | "none" => {
  if (h === 0) {
    if (getLetter(h, w) === getLetter(h + 1, w)) {
      return "forward";
    }
    return "none";
  }
  if (h === result.length - 1) {
    if (getLetter(h, w) === getLetter(h - 1, w)) {
      return "backward";
    }
    return "none";
  }
  if (getLetter(h, w) === getLetter(h + 1, w)) {
    return "forward";
  }
  if (getLetter(h, w) === getLetter(h - 1, w)) {
    return "backward";
  }
  return "none";
};

const App = () => {
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const letterButtonClicked = (letter: string) => {
    setUsedLetters([...usedLetters, letter]);
    const word = result[currentRow];
    const index = word.indexOf(letter);
    if (index !== -1 && isSameLetter(currentRow, index) === "forward") {
      setCurrentRow(currentRow + 1);
      setUsedLetters([letter]);
    } else if (!word.includes(letter)) {
      setFailedAttempts(failedAttempts + 1);
    }
  };

  return (
    <Container>
      <Paper>Failed attempts counter: {failedAttempts}</Paper>
      <DrawMatrix
        currentRow={currentRow}
        width={Math.max(...result.map((x) => x.length))}
        height={result.length}
        usedLetters={usedLetters}
      />
      <DrawKeyboardLine
        marginLeft={0}
        letters="QWERTYUIOP"
        onClick={(x) => letterButtonClicked(x)}
        usedLetters={usedLetters}
      />
      <DrawKeyboardLine
        marginLeft={5}
        letters="ASDFGHJKL"
        onClick={(x) => letterButtonClicked(x)}
        usedLetters={usedLetters}
      />
      <DrawKeyboardLine
        marginLeft={10}
        letters="ZXCVBNM"
        onClick={(x) => letterButtonClicked(x)}
        usedLetters={usedLetters}
      />
    </Container>
  );
};

const DrawKeyboardLine: FC<{
  marginLeft: number;
  letters: string;
  onClick: (letter: string) => void;
  usedLetters: string[];
}> = ({ marginLeft, letters, onClick, usedLetters }) => {
  return (
    <Stack marginLeft={marginLeft} marginTop={2} spacing={2} direction="row">
      {letters.split("").map((x) => (
        <Button onClick={() => onClick(x)} variant="contained" disabled={usedLetters.includes(x)}>
          {x}
        </Button>
      ))}
    </Stack>
  );
};

const DrawMatrix: FC<{ width: number; height: number; usedLetters: string[]; currentRow: number }> = ({
  width,
  height,
  usedLetters,
  currentRow,
}) => {
  return (
    <Stack direction="column">
      {Array.from({ length: height }, (x, i) => i).map((c) => (
        <Stack direction="row" style={{ background: currentRow === c ? "#5fb4de" : "" }}>
          {Array.from({ length: width }, (x, i) => i).map((r) => (
            <LetterSquare
              isSameLetterIndex={isSameLetter(c, r)}
              usedLetters={usedLetters}
              letter={getLetter(c, r)}
              currentRow={c}
              isCurrentRow={currentRow === c}
              isVisibleRow={c < currentRow}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

const LetterSquare: FC<{
  letter: string;
  usedLetters: string[];
  isSameLetterIndex: "forward" | "backward" | "none";
  isCurrentRow: boolean;
  isVisibleRow: boolean;
  currentRow: number;
}> = ({ letter, usedLetters, isSameLetterIndex, isCurrentRow, isVisibleRow, currentRow }) => {
  const isFound = usedLetters.includes(letter);
  const isInvisible = letter === undefined || letter.toUpperCase() === letter.toLowerCase();
  const letterToShow = isInvisible
    ? ""
    : !isCurrentRow && !isVisibleRow
    ? ""
    : !isFound && !isVisibleRow
    ? ""
    : letter.toUpperCase();

  const getBackground = () => {
    if (isSameLetterIndex === "none") {
      return "";
    }
    if (isSameLetterIndex === "forward") {
      return colors[currentRow];
    }
    if (isSameLetterIndex === "backward") {
      return colors[currentRow - 1];
    }
  };
  const background =
    isSameLetterIndex === "none" ? "" : colors[isSameLetterIndex === "forward" ? currentRow : currentRow - 1];
  return (
    <Paper
      elevation={3}
      style={{
        background: getBackground(),
        width: "50px",
        height: "50px",
        textAlign: "center",
        lineHeight: "50px",
        margin: "5px",
        fontSize: "18px",
        fontWeight: "bold",
        visibility: isInvisible ? "hidden" : "visible",
      }}
    >
      <span>{letterToShow}</span>
    </Paper>
  );
};

export default App;
