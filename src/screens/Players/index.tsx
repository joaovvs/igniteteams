import { FlatList } from "react-native";
import { useState } from "react";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";

export function Players() {
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState(["Rodrigo", 'Diego', 'João'])

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title="Nome da Turma"
        subtitle="adicione a galera e separe os times"
      />
      <Form>
        <Input placeholder="Nome da pessoa" autoCorrect={false} />

        <ButtonIcon icon="add" />
      </Form>

      <Filter title="Time A" isActive={false} />
      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={index => index}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>

      </HeaderList>
    </Container>
  );
}
