import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const LowPolyDog = (props) => {

  const { nodes, materials, animations } = useGLTF('/models/low_poly_dog.glb')
  const group = useRef()
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    materials.Black.color.set('#FEC01F')
    materials.Brown.color.set('#DAA520')
  }, [materials])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 6]}>
          <group name="Root">
            <group name="Lamp" position={[4.076, 1.005, 5.904]} rotation={[-0.268, 0.602, 1.931]}>
              <group name="Lamp_1" />
            </group>
            <group name="dog_Armature" position={[0, 0.759, 0.006]}>
              <group
                name="Bone006_dog_Armature"
                position={[0, 0.899, 2.162]}
                rotation={[-1.92, 0, 0]}>
                <group
                  name="IKFootL_dog_Armature"
                  position={[0.448, 1.744, 1.189]}
                  rotation={[1.92, 0, 0]}
                />
                <group
                  name="Bone005_dog_Armature"
                  position={[0, -0.6, 0]}
                  rotation={[-Math.PI, 0, 0]}>
                  <primitive object={nodes.pelvisM_dog_Armature} />
                </group>
                <group
                  name="IKFootR_dog_Armature"
                  position={[-0.448, 1.744, 1.189]}
                  rotation={[1.92, 0, 0]}
                />
                <group
                  name="IKHandL_dog_Armature"
                  position={[0.45, 2.745, -1.467]}
                  rotation={[1.92, 0, 0]}
                />
                <group
                  name="IKHandR_dog_Armature"
                  position={[-0.45, 2.745, -1.467]}
                  rotation={[1.92, 0, 0]}
                />
              </group>
              <group name="dog" position={[0, -0.759, 2.394]} />
            </group>
            <group name="Circle001" position={[0, 0.759, 0.006]} />
          </group>
          <skinnedMesh
            name="dog_0"
            geometry={nodes.dog_0.geometry}
            material={materials.Black}
            skeleton={nodes.dog_0.skeleton}
          />
          <skinnedMesh
            name="dog_1"
            geometry={nodes.dog_1.geometry}
            material={materials.Brown}
            skeleton={nodes.dog_1.skeleton}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/low_poly_dog.glb')

export default LowPolyDog;


