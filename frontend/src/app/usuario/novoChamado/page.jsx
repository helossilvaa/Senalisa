'use client';
import './novo.css';
import Header from '@/components/Header/header';
import Calendario from '@/components/Calendario/Calendario'

export default function Chamados() {

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
                    <label className="input-label">Item</label>
                    <input
                      type="text"
                      className="form-control"
                      name="item"
                      placeholder="Insira o item"
                      required=""
                      data-msg="Please enter a valid email address."
                    />
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
                    <label className="input-label">Status</label>
                  
                    <div className="form-check form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio1"
                        defaultValue="opcao1"
                      />
                     
                      <label className="form-check-label" htmlFor="inlineRadio1">
                      Finalizado
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="inlineRadioOptions"
                        id="inlineRadio2"
                        defaultValue="opcao2"
                      />
                      <label className="form-check-label" htmlFor="inlineRadio2">
                        Em processo
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              
              
              <div className="js-form-message mb-6">
                <label className="input-label">Deixe seu comentário</label>
                <div className="input-group">
                  <textarea
                    className="form-control"
                    rows={4}
                    name="text"
                    required=""
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