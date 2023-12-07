import { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { FlatList, Alert, TextInput } from "react-native";

import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayersStorageDTO";

type RouteParams ={
  group: string;
}

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert('Nova pessoa', 'Informe o nome da pesso parar adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);
      //remove focus on input name
      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert("Nova pessoa", error.message);

      }else{
        console.log(error);
        Alert.alert("Nova pessoa", 'Não foi possível adicionar.');
      }
    }
  }

  async function fetchPlayersByTeam(){
    try{
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);   
    }catch(error){
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();

  },[team,players]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adicione a galera e separe os times"
      />
      <Form>
        <Input 
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa" 
          autoCorrect={false}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
          />

        <ButtonIcon icon="add" onPress={handleAddPlayer}/>
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

      <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({item})=> (
          <PlayerCard 
            name={item.name}
            onRemove={()=> {}}/>
        )}
        ListEmptyComponent={() => (
          <ListEmpty
            message="Não há jogadores neste time"
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{paddingBottom: 100}, players.length === 0 && {flex: 1}]}
      />

      <Button
        title='Remover turma'
        type='SECONDARY'
      />
    </Container>
  );
}
