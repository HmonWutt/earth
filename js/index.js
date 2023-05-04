import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Vector3 } from 'three';


const scene = new THREE.Scene();
scene.background = 0x1c2e4a

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20

const canvas  = document.getElementById('canvas')

const renderer = new THREE.WebGLRenderer({canvas:canvas , antialias: true});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(devicePixelRatio)
//renderer.setClearColor(0x000000, 0)
const size = 10;
const divisions = 10;
const axesHelper = new THREE.AxesHelper( 2);
//scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( size, divisions );
//scene.add( gridHelper );
const controls = new OrbitControls( camera, canvas );
//controls.minPolarAngle = Math.PI/2.3
//controls.maxPolarAngle = Math.PI/2
controls.enableDamping = true
controls.enablePan = false

let earth =  new THREE.TextureLoader().load("../models/Earth.jpeg")
let geometry = new THREE.SphereGeometry(10,300,300)
// let material = THREE.ShaderMaterial(
//     {
//         extentions:{
//             derivatives:'#extension GL_OES_standard_derivatives: enable'
//         },
//         side: THREE.DoubleSide,
//         uniforms:{
//             time: {value:0} ,
//             resolution:{value: new THREE.Vector4()},
//         },
//         vertexShader: vertex,
//         fragmentShader: fragment
//     }
// )
//let material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
let material = new THREE.MeshBasicMaterial(
    { 
        map: earth
    })
let globe = new THREE.Mesh(geometry,material)

scene.add(globe)


function createdot(position){
let point = new THREE.Mesh
(
   new THREE.SphereGeometry(0.05,30,30),
   new THREE.MeshBasicMaterial({color:0xff0000})
)
point.position.set(position.x,position.y,position.z)
scene.add(point)
}


let pos1 = 
{
    lat: 55.36,
    long: 13.01
}
let pos2 = 
{
    lat: 43.06666,
    long: 141.35
}

let pos3=
{
    lat: 50.073658,
    long: 14.418540

}

let poses = [
    pos1,
    pos3,
    pos2
]

function createpoints(array){
    
    for (let i=0; i<array.length-1;i++)
    {  
       let position1 = latlongtocartesian(array[i])
       createdot(position1)
       let position2 = latlongtocartesian(array[i+1])
       createdot(position2)
       //d = ((x2 - x1)2 + (y2 - y1)2 + (z2 - z1)2) 1/2 
       let distance2 = ((position1.x - position2.x)**2+(position1.y - position2.y)**2+(position1.z - position2.z)**2)*0.5
       //console.log("distance",distance)
       if( distance2 <10) {distance2 = Math.round(distance2+10)}
       else {distance2 = Math.round(distance2)}
       getCurve(position1,position2)
       
    }
}

createpoints(poses)

function latlongtocartesian(pos)
{
    let phi = (90-pos.lat)*(Math.PI/180)
    let theta = (180+pos.long)*(Math.PI/180)
    let x= -10*(Math.sin(phi)*Math.cos(theta))
    let z = 10*(Math.sin(phi))*(Math.sin(theta))
    let y = 10*Math.cos(phi)
    return {x,y,z}
}


function getCurve(p1,p2)

{
    let v1 = new THREE.Vector3(p1.x, p1.y, p1.z)
    let v2 = new THREE.Vector3(p2.x, p2.y, p2.z)
    let points = []
    for (let i=0; i<=100;i++)
    {
        let p = new THREE.Vector3().lerpVectors(v1,v2,i/100);
        p.normalize()
        p.multiplyScalar(10+ 0.2*Math.sin(Math.PI*i/100))
        points.push(p)
    }
    
    let path = new THREE.CatmullRomCurve3(points)
    //console.log(path)
    const geometry = new THREE.TubeGeometry( path, 100, 0.02, 8, false );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const curve = new THREE.Mesh( geometry, material );
    scene.add( curve )
    return points
}

  let path = getCurve(latlongtocartesian(pos1),latlongtocartesian(pos2))
    let point = new THREE.Mesh
        (
        new THREE.SphereGeometry(0.15,30,30),
        new THREE.MeshBasicMaterial({color:0xff0000})
        )
        scene.add(point)
let clock = new THREE.Clock()

function animate(){
    
    let delta = clock.getElapsedTime()
    
   
        
        let index = Math.round(delta*10)
        if (index >= path.length) index = path.length-1
      

        point.position.x = path[index].x
        point.position.y = path[index].y
       point.position.z = path[index].z

            
        
    
    renderer.render(scene,camera)
   
    window.requestAnimationFrame(animate)
   
     controls.update()
    
   
}

animate()










