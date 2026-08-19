var db = {
  cursos: [
    {
      id: 1,
      nome: 'Enfermagem',
      modalidade: 'Integral',
      salariosAtuais: [
        {
          cargo: 'Enfermeiro',
          salario: 4750,
          referencia: 'Piso nacional da enfermagem - Lei 14.434/2022 (jornada de 44h)'
        },
        {
          cargo: 'Técnico de Enfermagem',
          salario: 3325,
          referencia: '70% do piso do enfermeiro - Lei 14.434/2022'
        },
        {
          cargo: 'Auxiliar de Enfermagem',
          salario: 2375,
          referencia: '50% do piso do enfermeiro - Lei 14.434/2022'
        }
      ],
      cotas: [
        {
          ano: '2025',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 14,
              candidatos: 54,
              notaMinima: 3430
            },
            {
              tipo: 'Escola Pública',
              vagas: 5,
              candidatos: 62,
              notaMinima: 3213
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 4,
              candidatos: 7,
              notaMinima: 2348
            },
            {
              tipo: 'Negros',
              vagas: 2,
              candidatos: 3,
              notaMinima: 2988
            },
            {
              tipo: 'PcD',
              vagas: 2,
              candidatos: 1,
              notaMinima: 3433
            },
            {
              tipo: 'Total',
              vagas: 27,
              candidatos: 127,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2024',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 14,
              candidatos: 68,
              notaMinima: 3414
            },
            {
              tipo: 'Escola Pública',
              vagas: 5,
              candidatos: 82,
              notaMinima: 3282
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 4,
              candidatos: 2,
              notaMinima: 2661
            },
            {
              tipo: 'Negros',
              vagas: 2,
              candidatos: 8,
              notaMinima: 2722
            },
            {
              tipo: 'PcD',
              vagas: 2,
              candidatos: 6,
              notaMinima: 1316
            },
            {
              tipo: 'Total',
              vagas: 27,
              candidatos: 166,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2023',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 11,
              candidatos: 67,
              notaMinima: 3426
            },
            {
              tipo: 'Escola Pública',
              vagas: 12,
              candidatos: 81,
              notaMinima: 2692
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 3,
              candidatos: 1,
              notaMinima: 2184
            },
            {
              tipo: 'Negros',
              vagas: 2,
              candidatos: 5,
              notaMinima: 1878
            },
            {
              tipo: 'PcD',
              vagas: 2,
              candidatos: 6,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 30,
              candidatos: 160,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2022',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 11,
              candidatos: 68,
              notaMinima: 3304
            },
            {
              tipo: 'Escola Pública',
              vagas: 12,
              candidatos: 65,
              notaMinima: 2762
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 3,
              candidatos: 5,
              notaMinima: 2146
            },
            {
              tipo: 'Negros',
              vagas: 2,
              candidatos: 2,
              notaMinima: 1381
            },
            {
              tipo: 'PcD',
              vagas: 2,
              candidatos: 1,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 30,
              candidatos: 141,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2021_primavera',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 7,
              candidatos: 83,
              notaMinima: 3739
            },
            {
              tipo: 'Escola Pública',
              vagas: 6,
              candidatos: 99,
              notaMinima: 3204
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 2,
              candidatos: 7,
              notaMinima: 2331
            },
            {
              tipo: 'Total',
              vagas: 15,
              candidatos: 189,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2020',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 15,
              candidatos: 131,
              notaMinima: 3059
            },
            {
              tipo: 'Escola Pública',
              vagas: 12,
              candidatos: 78,
              notaMinima: 2590
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: 3,
              candidatos: 10,
              notaMinima: 1919
            },
            {
              tipo: 'Total',
              vagas: 30,
              candidatos: 219,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2019',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 8,
              candidatos: 160,
              notaMinima: 3485
            },
            {
              tipo: 'Escola Pública',
              vagas: 1,
              candidatos: 131,
              notaMinima: 3052
            },
            {
              tipo: 'Negros',
              vagas: 6,
              candidatos: 10,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 15,
              candidatos: 301,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2018',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 11,
              candidatos: 171,
              notaMinima: 3485
            },
            {
              tipo: 'Escola Pública',
              vagas: 9,
              candidatos: 136,
              notaMinima: 3052
            },
            {
              tipo: 'Negros',
              vagas: 2,
              candidatos: 4,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 22,
              candidatos: 311,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2017',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 7,
              candidatos: 122,
              notaMinima: 3142
            },
            {
              tipo: 'Escola Pública',
              vagas: 2,
              candidatos: 112,
              notaMinima: 2925
            },
            {
              tipo: 'Escola Pública - Negros',
              vagas: null,
              candidatos: null,
              notaMinima: 2457
            },
            {
              tipo: 'Negros',
              vagas: 6,
              candidatos: 4,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 15,
              candidatos: 238,
              notaMinima: null
            }
          ]
        },
        {
          ano: '2016',
          tipoCota: [
            {
              tipo: 'Universal',
              vagas: 8,
              candidatos: 113,
              notaMinima: 3584
            },
            {
              tipo: 'Escola Pública',
              vagas: 6,
              candidatos: 104,
              notaMinima: 2611
            },
            {
              tipo: 'Negros',
              vagas: 1,
              candidatos: 5,
              notaMinima: null
            },
            {
              tipo: 'Total',
              vagas: 15,
              candidatos: 222,
              notaMinima: null
            }
          ]
        }
      ],
      analise: 'Curso integral em Ponta Grossa com concorrencia total historicamente alta (pico de 20,1 cand./vaga em 2019), em queda nos anos recentes ate 4,7 em 2025. A cota Escola Publica e a mais disputada (12,4 cand./vaga em 2025), enquanto Negros, Escola Publica-Negros e PcD costumam ficar abaixo de 2 cand./vaga. As notas minimas da ampla concorrencia oscilam entre 3.059 e 3.739, e as cotas raciais e PcD exigem notas bem menores, tornando-as o caminho mais acessivel de aprovacao.'
    }
  ]
};

if (typeof window !== 'undefined') window.db = db;
if (typeof module !== 'undefined') module.exports = { db };
