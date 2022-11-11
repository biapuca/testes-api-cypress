/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contrato from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
     })
    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'
     }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
     }) 
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     let usernameFaker = faker.internet.userName()          
     let emailFaker = faker.internet.email(usernameFaker)

     cy.novoUsuario (usernameFaker,emailFaker,"teste","false")
     .then((response) => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
     })  
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.novoUsuario ("Isadora Torres","aisadora.torres@gmail.com","teste","false")
     .then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal('Este email já está sendo usado')
     })   
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     let usernameFaker = faker.internet.userName()          
     let emailFaker = faker.internet.email(usernameFaker)

     cy.novoUsuario (usernameFaker,emailFaker,"teste","false")
     .then(response => {
          let id = response.body._id

          cy.request({
               method: 'PUT', 
               url: `usuarios/${id}`,                    
               body: 
               {
                    "nome": "Usuário Alterado Teste",
                    'email': emailFaker,
                    'password': 'teste',
                    'administrador': 'false'
               }
          }).then(response => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro alterado com sucesso')
          })
     })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let usernameFaker = faker.internet.userName()          
     let emailFaker = faker.internet.email(usernameFaker)

     cy.novoUsuario (usernameFaker,emailFaker,"teste","false")
     .then(response => {
          let id = response.body._id

          cy.request({
               method: 'DELETE', 
               url: `usuarios/${id}`,                    

          }).then(response => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')
          })
     })  
    });


});
