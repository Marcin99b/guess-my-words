import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";

const colors = ["#4287f5", "#42f56f", "#f2f542", "#eb4034", "#9c34eb"];

const getLetter = (h: number, w: number, result: string[]): string => {
  if (result.length < h) {
    return "";
  }
  const word = result[h];
  if (word.length < w) {
    return "";
  }
  return word[w];
};

const isSameLetter = (h: number, w: number, result: string[]): "forward" | "backward" | "none" => {
  if (h === 0) {
    if (getLetter(h, w, result) === getLetter(h + 1, w, result)) {
      return "forward";
    }
    return "none";
  }
  if (h === result.length - 1) {
    if (getLetter(h, w, result) === getLetter(h - 1, w, result)) {
      return "backward";
    }
    return "none";
  }
  if (getLetter(h, w, result) === getLetter(h + 1, w, result)) {
    return "forward";
  }
  if (getLetter(h, w, result) === getLetter(h - 1, w, result)) {
    return "backward";
  }
  return "none";
};

const App = () => {
  const [result, setResult] = useState<string[]>(["CYCLING", " INSIDE", "    ELECTRICITY", "RECYCLING"]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    setUsedLetters([]);
    setCurrentRow(0);
    setFailedAttempts(0);
    setScore(0);
  }, [result]);

  const letterButtonClicked = (letter: string) => {
    setUsedLetters([...usedLetters, letter]);
    const word = result[currentRow];
    const index = word.indexOf(letter);
    if (!word.includes(letter)) {
      setFailedAttempts(failedAttempts + 1);
    } else {
      if (currentRow === result.length - 1) {
        setScore(score + 1);
      } else if (index !== -1 && isSameLetter(currentRow, index, result) === "forward") {
        setCurrentRow(currentRow + 1);
        setUsedLetters([letter]);
        setScore(score + 1);
      }
    }
  };

  return (
    <Container>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => {
            setResult(["CYCLING", " INSIDE", "    ELECTRICITY", "RECYCLING"]);
          }}
        >
          Result pack 1
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setResult(["ROWER", "  WTOREK", "   TYDZIEN", "    KOMIN", "    DOTACJE"]);
          }}
        >
          Result pack 2
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setResult(["COMPUTER", "  PHONE", "   RUN", "  BRIDGE", "      BEAN"]);
          }}
        >
          Result pack 3
        </Button>
      </Stack>

      <Stack direction="row">
        <Paper style={{ margin: 10, padding: 10 }}>Failed attempts counter: {failedAttempts}</Paper>
        <Paper style={{ margin: 10, padding: 10 }}>Points: {score}</Paper>
        <Paper style={{ margin: 10, padding: 10 }}>Result: {score - failedAttempts}</Paper>
      </Stack>

      <DrawMatrix
        currentRow={currentRow}
        width={Math.max(...result.map((x) => x.length))}
        height={result.length}
        usedLetters={usedLetters}
        result={result}
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

const DrawMatrix: FC<{
  width: number;
  height: number;
  usedLetters: string[];
  currentRow: number;
  result: string[];
}> = ({ width, height, usedLetters, currentRow, result }) => {
  return (
    <Stack direction="column">
      {Array.from({ length: height }, (x, i) => i).map((c) => (
        <Stack direction="row" style={{ background: currentRow === c ? "#5fb4de" : "" }}>
          {Array.from({ length: width }, (x, i) => i).map((r) => (
            <LetterSquare
              isSameLetterIndex={isSameLetter(c, r, result)}
              usedLetters={usedLetters}
              letter={getLetter(c, r, result)}
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
