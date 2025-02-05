import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

const QuestionMark = (props) => {
  const { nodes, materials } = useGLTF('/models/question_mark.glb')
  const meshRef = useRef();

  useEffect(() => {
    if (materials['Material.001']) {
      materials['Material.001'].color.set('#EE8989');
    }
  }, [materials]);
  
  return (
    <group {...props} dispose={null} ref={meshRef}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Torus002_Material001_0.geometry}
          material={materials['Material.001']}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/question_mark.glb')

export default QuestionMark;
