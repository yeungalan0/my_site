import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { Fragment, useEffect, useRef, useState } from "react";
import * as constants from "../src/couple-game/constants";
import { DefaultGridLayout } from "../src/layout";
import { darkTheme as theme } from "../src/theme";

// style={{ border: "solid 1px", backgroundColor: "orange" }}

const useStyles = makeStyles(() => ({
  footer: {
    top: "auto",
    bottom: 0,
    background: "transparent",
    boxShadow: "none",
    color: "black",
    textAlign: "center",
    position: "fixed",
  },
  title: {
    padding: theme.spacing(2),
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  start: {
    paddingBottom: theme.spacing(3),
  },
  cardGrid: {
    display: "flex",
  },
  gameCard: {
    width: "50%",
    minWidth: "20vw",
    height: "20vh",
    overflow: "auto",
    maxHeight: "20%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: theme.spacing(1),
  },
  cardType: {
    marginBottom: theme.spacing(3),
  },
  pointButtons: {
    display: "flex",
  },
  playerStats: {
    boxShadow: "none",
  },
}));

export default function CoupleGame(): JSX.Element {
  const classes = useStyles();

  return (
    <Fragment>
      <DefaultGridLayout // Can't use DefaultLayout because of the extra AppBar
        title={
          <Grid item>
            <Typography variant="h4" align="center" className={classes.title}>
              Welcome to the couple game! 💕😘
            </Typography>
          </Grid>
        }
      >
        <Content />
      </DefaultGridLayout>
      <AppBar position="sticky" className={classes.footer}>
        <p>Dedicated to my wonderful girlfriend, Jen 😳😽</p>
      </AppBar>
    </Fragment>
  );
}

function Content() {
  const [players, setPlayers] = useState<string[]>([]);
  const [cardsTodo, setCardsTodo] = useState(-1);
  const [cont, setCont] = useState(false);
  const playerInput = useRef<HTMLInputElement>(null);
  const classes = useStyles();

  useEffect(() => {
    const savedPlayersJSON = localStorage.getItem(constants.PLAYERS_KEY);
    const savedIndexes = localStorage.getItem(constants.INDEXES_KEY);
    if (savedPlayersJSON !== null && savedIndexes !== null) {
      setPlayers(JSON.parse(savedPlayersJSON));
      setCardsTodo(JSON.parse(savedIndexes).length);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const inputVal = playerInput.current ?? { value: "" };
    const inputPlayers = inputVal.value.split(",").map((s) => s.trim());
    if (inputPlayers.length < 2 || inputPlayers.includes("")) {
      alert(
        `Not enough players detected or an empty player detected! Players: ${inputPlayers.join(
          ", "
        )}`
      );
    } else {
      setPlayers(inputPlayers);
      setCont(true);
      resetCards();
      localStorage.setItem(constants.PLAYERS_KEY, JSON.stringify(inputPlayers));
      event.preventDefault();
    }
  }

  if (players.length > 0 && cont) {
    return <CoupleGameBoard players={players} />;
  } else {
    return (
      <div className={classes.content}>
        <form onSubmit={handleSubmit} className={classes.start}>
          <div>
            <TextField
              label="Alan,Jen"
              helperText="Enter comma separated names"
              inputRef={playerInput}
            ></TextField>
          </div>
          <Button variant="contained" type="submit">
            Start new game
          </Button>
        </form>
        <ContinueGame
          players={players}
          cardsTodo={cardsTodo}
          onContinue={setCont}
        ></ContinueGame>
      </div>
    );
  }
}

function ContinueGame({
  players,
  cardsTodo,
  onContinue,
}: {
  players: string[];
  cardsTodo: number;
  onContinue: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element | null {
  if (players.length === 0) {
    return null;
  }
  return (
    <div>
      <p>
        Saved game detected, continue as: {players.join(", ")}? ({cardsTodo}{" "}
        cards left)
      </p>
      <Button variant="contained" onClick={() => onContinue(true)}>
        Continue
      </Button>
    </div>
  );
}

function CoupleGameBoard({ players }: { players: string[] }): JSX.Element {
  const classes = useStyles();
  const [card, setCard] = useState(() => drawCard());
  const [turn, setTurn] = useState(0);
  const [playerStats, setPlayerStats] = useState(() => resetPlayerStats());

  function resetPlayerStats() {
    return players.map((player) => new PlayerStat(player, 0));
  }

  function nextTurn() {
    setCard(drawCard());
    setTurn((turn + 1) % players.length);
  }

  function pointEarned() {
    playerStats[turn].incrementScore();
    setPlayerStats(playerStats);
    nextTurn();
  }

  const allCards =
    constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length;
  const cardsTodo = JSON.parse(getFromStorage(constants.INDEXES_KEY)).length;

  return (
    <div className={classes.content}>
      <Grid container direction="column">
        <Grid container item justify="center" spacing={2}>
          {getPlayerStatCards(playerStats, turn)}
        </Grid>
        <Grid item>
          Card: {cardsTodo}/{allCards}
        </Grid>
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          className={classes.cardGrid}
        >
          <CurrentCard card={card}></CurrentCard>
        </Grid>
        <Grid container item justify="center" className={classes.pointButtons}>
          <PointButtons
            nextTurn={nextTurn}
            pointEarned={pointEarned}
          ></PointButtons>
        </Grid>
        <ResetButton
          setPlayerStats={setPlayerStats}
          resetPlayerStats={resetPlayerStats}
          setCard={setCard}
        ></ResetButton>
      </Grid>
    </div>
  );
}

function CurrentCard({ card }: { card: GameCard }) {
  const classes = useStyles();

  return (
    <Card variant="outlined" className={classes.gameCard}>
      <CardContent>
        <Typography
          color="textSecondary"
          gutterBottom
          className={classes.cardType}
        >
          <b>{card.type}</b>
        </Typography>
        <Typography>{card.text}</Typography>
      </CardContent>
    </Card>
  );
}

function PointButtons({
  nextTurn,
  pointEarned,
}: {
  nextTurn: () => void;
  pointEarned: () => void;
}) {
  return (
    <Fragment>
      <Button variant="contained" size="small" onClick={() => nextTurn()}>
        Incorrect 😓
      </Button>
      <Box padding={theme.spacing(0.2)}></Box>
      <Button variant="contained" size="small" onClick={() => pointEarned()}>
        Correct 🙂
      </Button>
    </Fragment>
  );
}

type ResetProps = {
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStat[]>>;
  resetPlayerStats: () => PlayerStat[];
  setCard: React.Dispatch<React.SetStateAction<GameCard>>;
};

function ResetButton({
  setPlayerStats,
  resetPlayerStats,
  setCard,
}: ResetProps) {
  function reset() {
    resetCards();
    setPlayerStats(resetPlayerStats());
    setCard(drawCard());
  }

  return (
    <Box
      height="18vh"
      display="flex"
      alignItems="flex-end"
      justifyContent="center"
      flex="1 0 auto"
    >
      <Grid item>
        <Button variant="contained" color="secondary" onClick={() => reset()}>
          Reset
        </Button>
      </Grid>
    </Box>
  );
}

type PlayerStatStyleProps = {
  color: "initial" | "textSecondary";
  gutterBottom: boolean;
  variant: "outlined" | undefined;
  title: string;
};

function getPlayerStatCards(playerStats: PlayerStat[], turnIndex: number) {
  const playerStatCards: JSX.Element[] = [];

  playerStats.forEach((playerStat, index) => {
    let inputProps: PlayerStatStyleProps = {
      color: "textSecondary",
      gutterBottom: true,
      variant: undefined,
      title: "",
    };
    if (turnIndex === index) {
      inputProps = {
        color: "initial",
        gutterBottom: false,
        variant: "outlined",
        title: "Your turn to earn points!",
      };
    }

    playerStatCards.push(
      <PlayerStatCard
        styleProps={inputProps}
        playerStat={playerStat}
        key={playerStatCards.length}
      ></PlayerStatCard>
    );

    if (index !== playerStats.length - 1) {
      playerStatCards.push(
        <Grid item key={playerStatCards.length}>
          <Box display="flex" alignItems="center" height="100%">
            ❤️
          </Box>
        </Grid>
      );
    }
  });

  return playerStatCards;
}

function PlayerStatCard({
  styleProps,
  playerStat,
}: {
  styleProps: PlayerStatStyleProps;
  playerStat: PlayerStat;
}) {
  const classes = useStyles();

  return (
    <Grid item>
      <Tooltip title={styleProps.title}>
        <Card variant={styleProps.variant} className={classes.playerStats}>
          <CardContent>
            <Typography
              color={styleProps.color}
              gutterBottom={styleProps.gutterBottom}
            >
              <b>{playerStat.name}</b>
            </Typography>
            <Typography>{playerStat.score}</Typography>
          </CardContent>
        </Card>
      </Tooltip>
    </Grid>
  );
}

function getFromStorage(key: string): string {
  const val = localStorage.getItem(constants.INDEXES_KEY);
  if (val === null) {
    throw ReferenceError(`Value is null! key: ${key}`);
  }

  return val;
}

function resetCards(): void {
  const size = constants.GUESS_LIST.length + constants.CHALLENGE_LIST.length;
  const possibleIndexes = Array.from(Array(size).keys());

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes));
}

function drawCard(): GameCard {
  const index = getRandomIndexAndUpdateStorage();
  if (index === -1) {
    return new GameCard("GAME OVER", "All cards completed!");
  }

  if (typeof constants.GUESS_LIST[index] !== "undefined") {
    return new GameCard(constants.GUESS_CARD, constants.GUESS_LIST[index]);
  } else {
    const challengeIndex = index - constants.GUESS_LIST.length;
    return new GameCard(
      constants.CHALLENGE_CARD,
      constants.CHALLENGE_LIST[challengeIndex]
    );
  }
}

class PlayerStat {
  name: string;
  score: number;

  constructor(name: string, score: number) {
    this.name = name;
    this.score = score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class GameCard {
  type: string;
  text: string;

  constructor(cardType: string, cardText: string) {
    this.type = cardType;
    this.text = cardText;
  }
}

function getRandomIndexAndUpdateStorage(): number {
  const possibleIndexes: number[] = JSON.parse(
    getFromStorage(constants.INDEXES_KEY)
  );
  if (possibleIndexes.length === 0) {
    return -1;
  }

  const index = Math.floor(Math.random() * possibleIndexes.length);
  const cardsIndex = possibleIndexes[index];

  possibleIndexes.splice(index, 1);

  localStorage.setItem(constants.INDEXES_KEY, JSON.stringify(possibleIndexes));

  return cardsIndex;
}
