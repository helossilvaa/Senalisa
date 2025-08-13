'use client';
import './novo.css';
import Header from '@/components/Header/header';
<<<<<<< HEAD
import Calendario from '@/components/Calendario/Calendar'
=======
import Calendario from '@/components/Calendario/Calendario'
import React, { useState, useEffect } from 'react'; 
>>>>>>> a527335c0d62772830919ddb02edb6b83d92bce4

export default function Chamados() {
  const [titulo, setTitulo] = useState(''); 
  const [descricao, setDescricao] = useState(''); 
  const [tipoId, setTipoId] = useState(''); 
  const [salaId, setSalaId] = useState(''); 
  const [equipamentoId, setEquipamentoId] = useState(''); 
  const [salas, setSalas] = useState([]); 
  const [equipamentos, setEquipamentos] = useState([]); 
  const [pools, setPools] = useState([]); 
  const [chamadoCriado, setChamadoCriado] = useState(null); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const 
  })

  return (
    <div className="d-flex">
      <Header />
      <div className="container">


        <div className="container space-2">
         
          <div className="w-md-80 w-lg-50 mx-md-auto mb-5 mb-md-9">
            <h2  className="fw-bold">Novo chamado</h2>
          </div>
         
          <div className="w-lg-80 mx-auto">
           
            <form className="js-validate">
              <div className="row">
                
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    <label className="input-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Insira seu nome"
                      required=""
                      data-msg="Please enter your name."
                    />
                  </div>
                </div>
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    <label className="input-label">Tipo de assistência</label>
                    <select id="inputState" class="form-select">
                    <option selected>Selecione</option>
                    <option>...</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    <label className="input-label">Sala</label>
                    <select id="inputState" class="form-select">
                    <option selected>Selecione</option>
                    <option>...</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    <label className="input-label">Equipamento</label>
                    <select id="inputState" class="form-select">
                    <option selected>Selecione</option>
                    <option>...</option>
                    </select>
                  </div>
                </div>
               
                <div className="w-100" />
            
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    <Calendario />
                  </div>
                </div>
             

                
                <div className="col-sm-6 mb-4">
                  <div className="js-form-message">
                    
                    </div>
                  </div>
               
              </div>

              
              
              <div className="js-form-message mb-6">
                <label className="input-label">Descrição</label>
                <div className="input-group">
                  <textarea
                    className="form-control"
                    rows={4}
                    name="text"
                    required=""
                    placeholder='Descreva aqui o problema'
                    data-msg="Please enter a reason."
                    defaultValue={""}
                  />
                </div>
              </div>
              
              <div className="enviar">
                <button
                  type="submit"
                  className="btn btn-wide mb-4"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
  


      </div>
    </div>
  );
}