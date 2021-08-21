/* const x =1 ; 
let y = 5; 

console.log(x,y); 

y += 10; 
console.log(x,y); 

y = 'sometext'; 
console.log(x,y); 
//x=4 ; 

const t = [1, -1, 3]; 

t.push(5); 

console.log(t.length); 
console.log(t[1]); 

t.forEach(value =>{
    console.log(value); 
}) */

/* const object1 = {
    name: 'Artos Hellas', 
    age: 35, 
    education: 'PhD',
}

const object2 = {
    name: 'Full stack web application development', 
    level: 'intermediate studies', 
    size: 5, 
}

const object3 = {
    name: {
        first: 'Dan', 
        last: 'Abramov', 
    },
    grades: [2,3,5,3], 
    department: 'Standford University', 
    
}

console.log(object1.name); 
const fieldName = 'age'; 
console.log(object1[fieldName]); 

object1.address = 'Helsinki'; 
object1['secret number'] = 12341;  */

const sum = (p1, p2) => {
    console.log(p1); 
    console.log(p2); 
    return p1+p2;
}

const result = sum(1,5); 
console.log(result); 

const square = p => {
    console.log(p); 
    return p*p; 
}