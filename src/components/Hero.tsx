import React from "react"
import { useRef, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import * as THREE from "three"

const Hero: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cubeRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(200, 200)
    cubeRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true })
    const cube = new THREE.Mesh(geometry, material)

    scene.add(cube)
    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cubeRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section className="py-20 text-center relative">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4">AI-Powered DAO Governance</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Revolutionize your DAO experience with AI agents that optimize yield, execute cross-chain arbitrage, and
          participate in decentralized governance.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors">
          Start Here
          <ArrowRight className="ml-2" />
        </button>
      </div>
      <div ref={cubeRef} className="absolute top-1/2 right-10 transform -translate-y-1/2 hidden lg:block" />
    </section>
  )
}

export default Hero