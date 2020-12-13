import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';

export default function App() {
  const baseURL = 'https://api.themoviedb.org/3/search/movie?api_key=a2b4573a496a96a1c6db51a2bbfa61bb&language=pt-BR';
  const precisionURL= 'https://api.themoviedb.org/3/movie/'
  const precisionURL2 = '?api_key=a2b4573a496a96a1c6db51a2bbfa61bb&language=pt-BR'
  const [state, setState] = useState({
    search: "Procure um Filme...",
    results: [],
    selected: {}
  });

  const pesquisar = () =>{
    axios(baseURL +'&query='+state.search).then(({
      data
    }) =>{
      let results = data.results;
      setState(prevState =>{
        return {...prevState, results: results}
      })
    })
  }

  const openPopup = id =>{
    axios(precisionURL+id+precisionURL2).then(({ data }) => {
      let result = data;

      setState(prevState =>{
        return {...prevState, selected: result}
        
      })
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa de Filmes</Text>
      <TextInput 
      style={styles.searchBox}
      onChangeText={text => setState(prevState =>{
        return {...prevState, search: text}
      })}
      onSubmitEditing={pesquisar}
      value={state.search}
      />
     <ScrollView style={styles.results}>
        {state.results.map(result =>(
          <TouchableHighlight key={result.id} onPress={() => openPopup(result.id)}>
          <View style={styles.result}>
            <Text style={styles.heading}>{result.title}</Text>
            <Image source={{uri: 'https://image.tmdb.org/t/p/w342/'+result.poster_path}} style={{width: '100%', height: 500,}} resizeMode="cover"/>
          </View>
          </TouchableHighlight>
        ))}
     </ScrollView>

    <Modal animationType='fade' transparent={false} visible={typeof state.selected.title != "undefined"}>
    <View style={styles.popup}>
      <Text style={styles.popTitle}>{state.selected.title}</Text>
      <Text style={{marginBottom: 20, marginTop: 10}}>Avaliação: {state.selected.vote_average}/10</Text>
      <Text>{state.selected.overview}</Text>
      </View>
      <TouchableHighlight onPress={() => setState(prevState =>{
        return { ...prevState, selected: {}}
      })}>
        <Text style={styles.closeBtn}>Fechar</Text>
      </TouchableHighlight>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20
  },
  title:{
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20

  },
  searchBox:{
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 40
  }, results:{
    flex: 1
    },
    result:{
      flex: 1,
      width: '100%',
      marginBottom: 20 
    },
    heading: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '700',
      padding: 20,
      backgroundColor: '#445565',
      textAlign: 'center'
    },
    popup:{
      padding: 20
    },
    popTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 5
    },
    closeBtn: {
      padding: 20,
      fontSize: 20,
      fontWeight: '700',
      color: '#FFF',
      backgroundColor: '#2484C4'
    }

});
