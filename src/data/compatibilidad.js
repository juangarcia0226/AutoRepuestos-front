// Compatibilidad: id del producto -> vehículos (con rango de años) a los que le sirve
const v = (marca, modelo, desde, hasta) => ({ marca, modelo, desde, hasta })

export const COMPATIBILIDAD_INICIAL = {
  1:  [v('Chevrolet', 'Spark GT', 2010, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Chevrolet', 'Aveo', 2008, 2017), v('Renault', 'Logan', 2010, 2018), v('Kia', 'Picanto', 2008, 2016)],
  2:  [v('Chevrolet', 'Spark GT', 2015, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Kia', 'Rio', 2010, 2017), v('Kia', 'Picanto', 2012, 2023)],
  3:  [v('Chevrolet', 'Spark GT', 2010, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Mazda', 'Mazda 2', 2010, 2022), v('Mazda', 'Mazda 3', 2010, 2018), v('Toyota', 'Corolla', 2009, 2018), v('Renault', 'Logan', 2010, 2022)],
  4:  [v('Chevrolet', 'Spark GT', 2013, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Renault', 'Sandero', 2009, 2022)],
  5:  [v('Toyota', 'Corolla', 2009, 2023), v('Mazda', 'Mazda 3', 2010, 2023), v('Mazda', 'CX-5', 2013, 2023), v('Renault', 'Duster', 2012, 2023)],
  6:  [v('Chevrolet', 'Aveo', 2008, 2017), v('Renault', 'Logan', 2010, 2022), v('Renault', 'Sandero', 2009, 2022), v('Kia', 'Rio', 2010, 2023), v('Kia', 'Picanto', 2008, 2023)],
  7:  [v('Mazda', 'Mazda 3', 2010, 2023), v('Mazda', 'CX-5', 2013, 2023), v('Toyota', 'Corolla', 2009, 2023), v('Toyota', 'Hilux', 2010, 2023)],
  8:  [v('Chevrolet', 'Spark GT', 2010, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Kia', 'Picanto', 2008, 2023), v('Kia', 'Rio', 2010, 2023), v('Mazda', 'Mazda 2', 2010, 2022), v('Renault', 'Logan', 2010, 2022)],
  9:  [v('Toyota', 'Corolla', 2009, 2023), v('Toyota', 'Hilux', 2010, 2023), v('Mazda', 'Mazda 3', 2010, 2016)],
  10: [v('Chevrolet', 'Spark GT', 2016, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Chevrolet', 'Aveo', 2008, 2017), v('Renault', 'Duster', 2012, 2023)],
  11: [v('Renault', 'Logan', 2010, 2022), v('Renault', 'Sandero', 2009, 2022), v('Chevrolet', 'Aveo', 2008, 2017), v('Kia', 'Rio', 2010, 2023)],
  12: [v('Chevrolet', 'Spark GT', 2010, 2020), v('Chevrolet', 'Sail', 2012, 2020), v('Mazda', 'Mazda 2', 2010, 2022), v('Mazda', 'Mazda 3', 2010, 2023), v('Kia', 'Picanto', 2008, 2023), v('Kia', 'Rio', 2010, 2023)],
}