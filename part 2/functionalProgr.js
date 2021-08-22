var animals = [
    {name: 'Fluffykins', species: 'rabbit'}, 
    {name: 'Cara', species: 'dog'}, 
    {name: 'Hamilton', species: 'dog'}, 
    {name: 'Harold', species: 'fish'}
]

var dog = animals.filter(function(animal){
    return animal.species === 'dog'
})

console.log(dog)

var names = animals.map(animal =>animal.name)


console.log(names)

var orders = [
    {amount: 250}, 
    {amount: 400}, 
    {amount: 100}, 
    {amount: 325}
]


/*
var totalAmount =0 

for(var i =0; i< orders.length; i++)
{
    totalAmount += orders[i].amount
}

console.log(totalAmount)
*/
/*
var totalAmount = orders.reduce(function(sum,order){
    console.log('sum', sum, 'order',order)
    return sum+ order.amount
}, 0)*/

var totalAmount = orders.reduce((sum,order) =>sum+ order.amount, 0)

console.log(totalAmount)