import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const DogBone = (props) => {
    const { nodes, materials } = useGLTF('/models/dog_treat.glb');
    const meshRef = useRef();

    return (
        <group {...props} dispose={null} ref={meshRef}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.pPlane1_lambert1_0.geometry}
                material={materials.lambert1}
                position={[-0.2, -0.28, -0.15]}
                rotation={[0, 0, -2.016]}
                scale={0.15} // Reduced scale to fit inside the orb
            />
        </group>
    );
};

useGLTF.preload('/models/dog_treat.glb');

export default DogBone;