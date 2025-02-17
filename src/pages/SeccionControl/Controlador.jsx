import React, { useState } from "react";
import { View, Vibration } from "react-native";
import { styles } from "./Controlador.styles";
import ABMComic from "./ABM/Comic/InterfazComic";
import ABMComida from "./ABM/Comida/InterfazComida";
import SoundButton from "../../components/SoundButton/SoundButton";

import back from "../../assets/sounds/sfx-cancel.mp3";

function Controlador() {
  const [verComida, setVerComida] = useState(false);
  const [verComic, setVerComic] = useState(false);
  const [verCancelar, setVerCancelar] = useState(false);

  // Funciones para abrir y cerrar las interfaces
  const abrirABMComida = () => {
    setVerComida(true);
    setVerCancelar(true);
  };

  const abrirABMComic = () => {
    setVerComic(true);
    setVerCancelar(true);
  };

  const cancelar = () => {
    setVerCancelar(false);
    setVerComida(false);
    setVerComic(false);
    Vibration.vibrate(20); // Vibración al cancelar
  };

  return (
    <View style={styles.container}>
      {/* Botón de cancelar (condicional) */}
      {verCancelar && (
        <SoundButton
          title="Cancelar"
          onPress={cancelar}
          sfx={back}
          style={[styles.button, { backgroundColor: "red" }]}
        />
      )}

      {/* Botones principales (condicional) */}
      {!verCancelar && (
        <>
          <SoundButton
            title="ABM COMIDAS"
            onPress={abrirABMComida}
            style={[styles.button, { backgroundColor: "green" }]}
          />
          <SoundButton
            title="ABM COMICS"
            onPress={abrirABMComic}
            style={[styles.button, { backgroundColor: "blue" }]}
          />
        </>
      )}

      {/* Interfaces ABM (condicionales) */}
      {verComida && <ABMComida />}
      {verComic && <ABMComic />}
    </View>
  );
}

export default Controlador;
