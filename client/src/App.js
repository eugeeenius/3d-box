import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as THREE from 'three'

function App() {
  const [form, setForm] = useState({ width: '', height: '', length: '' })
  const [values, setValues] = useState({vectors:[], triangles:[]})
  const [valid, setValid] = useState(true) // Toggles button disabled
  
  // Set form when input.target.value changed
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  // Sending request on click
  const submitHandler = async (event) => {
    event.preventDefault()

    setValid(!valid)

    // Posting values from inputs
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...form }),
    });

    // Getting computed geometry from server
    const body = await response.json()
    await setValues({...values, ...body})

    // Clearing inputs
    Object.keys(form).forEach(el => {
      if(el) document.getElementById(`${el}`).value = ''
    })

    setValid(valid)
  }

  // Three.js 
  useEffect(() => {
    // Create camera
    const ASPECT_RATIO = window.innerWidth  / window.innerHeight
    let camera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10)
    camera.position.z = 5
  
    // Create scene
    let scene = new THREE.Scene()
    scene.background = new THREE.Color(0x555555)
  
    // Add light
    {
      const light = new THREE.PointLight(0xffffff)
      light.position.set(200, 200, 100)
      scene.add(light)
    }
    {
      const light = new THREE.AmbientLight(0x404040)
      scene.add(light)
    }
    
    // Create mesh (box)
    const geometry = new THREE.Geometry()

    // Create three.js vectors
    values.vectors.forEach(v => {
      geometry.vertices.push(new THREE.Vector3(...v))
    })
    
    // Create three.js triangles
    values.triangles.forEach(t => {
      geometry.faces.push(new THREE.Face3(...t))
    })

    geometry.computeFaceNormals()

    const material = new THREE.MeshPhongMaterial({ color: 0xFEFEFE })
    let mesh = new THREE.Mesh(geometry, material)
  
    // Set mesh position
    mesh.rotation.y += 0.8
    mesh.rotation.x += 0.25
  
    scene.add(mesh)
    
    // Render box
    const canvas = document.getElementById('canvas')
    let renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
  }, [values])
  
  return (
      <>
        <Form className="form">
          <Form.Group className="formGroup">
            <Form.Control type="number" name="width" id="width" placeholder="Width" onChange={changeHandler} />
            <Form.Control type="number" name="height" id="height" placeholder="Height"
              onChange={changeHandler} />
            <Form.Control type="number" name="length" id="length" placeholder="Length"
              onChange={changeHandler} />
          </Form.Group>
          <Button
            className="btn"
            variant="outline-primary"
            onClick={submitHandler}
            disabled={!valid}
          >
            Build
          </Button>
        </Form>
        <canvas id="canvas"></canvas>
      </>
  )
}

export default App
