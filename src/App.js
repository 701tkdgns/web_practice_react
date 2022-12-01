import React, { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import './App.css'

function Controls(props) {
    const { camera, gl } = useThree()
    const ref = useRef()
    useFrame(() => ref.current.update())
    return <OrbitControls ref={ref} target={[0, 0, 0]} {...props} args={[camera, gl.domElement]} />
}

function Dome() {
    const texture = useLoader(THREE.TextureLoader, './assets/test2.jpg')
    return (
        <mesh>
            <sphereBufferGeometry attach="geometry" args={[100, 60, 40]} />  {/* args = width, length, depth, (가로 세로 높이)  >> new THREE.BoxGeometry(2, 2, 2) 동일 */}
            <meshBasicMaterial attach="material" map={texture} side={THREE.BackSide} />
        </mesh>
    )
}


const App = () => {
    return (
        <Canvas camera={{ positoin: [0, 0, 0.1] }}>
            <Controls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.2} autoRotate={false} rotateSpeed={-0.5} />
            <Suspense fallback={null}>
                <Dome />
            </Suspense>
        </Canvas>
    )
}

export default App

// Suspense라는 React의 신기술을 사용하면 컴포넌트의 랜더링을 어떤 작업이 끝날 때까지 잠시 중단시키고
// 다른 컴포넌트를 먼저 랜더링할 수 있습니다. 이 작업이 꼭 어떠한 작업이 되어야 한다는 특별한 제약 사항은 없지만
// 아무래도 REST API나 GraphQL을 호출하여 네트워크를 통해 비동기로(asynchronously) 데이터를 가져오는 작업을 가장 먼저 떠오르게 됩니다.

// react fiber
// Canvas = scene + camera
// 캔버스는 부모 노드에 맞게 반응하므로 부모의 너비와 높이를 변경하여 크기를 제어할 수 있습니다.

