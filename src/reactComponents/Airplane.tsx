
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/models/cute_airplane.glb");
  return (
    <group {...props} dispose={null}>
      <group
        position={[0.386, -0.286, -41.358]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <group position={[0, -15.428, 25.489]} rotation={[1.5, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <group scale={[1, 3, 1]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["������_������_0"].geometry}
                material={materials.material}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["������_������1_0"].geometry}
                material={materials.material_1}
              />
            </group>
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_2_������_0"].geometry}
            material={materials.material}
            position={[0, 97.125, 0]}
            scale={[1, 1, 1.21]}
          />
        </group>
        <group position={[-0.836, 148.664, -109.803]} rotation={[1.5, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_2_������1_0"].geometry}
            material={materials.material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_2_������_0_1"].geometry}
            material={materials.material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_������_0_1"].geometry}
            material={materials.material}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>
        <group position={[0, -274.093, 43.88]} rotation={[1.5, 0, 0]}>
          <group position={[0, 0, -4.247]}>
            <group
              position={[0, 41.779, 4.135]}
              rotation={[Math.PI / 2, Math.PI / 2, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["���������_2_������1_0"].geometry}
                material={materials.material_1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["���������_2_������_0"].geometry}
                material={materials.material}
              />
            </group>
          </group>
        </group>
        <group
          position={[0, 204.904, 98.426]}
          rotation={[-1.964, 0, -Math.PI / 2]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_������1_0_1"].geometry}
            material={materials.material_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_������_0_2"].geometry}
            material={materials.material}
          />
        </group>
        <group position={[0, -15.428, 25.489]} rotation={[1.5, 0, 0]}>
          <group position={[0, 18.143, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_1_������_0"].geometry}
              material={materials.material}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_������_0_3"].geometry}
              material={materials.material}
              position={[0, 20.465, 0]}
            />
          </group>
          <group position={[0, 8.553, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_2_������_0_2"].geometry}
              material={materials.material}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_������_0_4"].geometry}
              material={materials.material}
              position={[0, 4.376, 0]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_������1_0_2"].geometry}
            material={materials.material_1}
            position={[0, 20.944, 0]}
          />
          <group position={[0, 2.181, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_15_������_0"].geometry}
              material={materials.material}
              position={[0, 0, -28.426]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_14_������_0"].geometry}
              material={materials.material}
              position={[11.562, 0, -25.969]}
              rotation={[0, -0.419, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_13_������_0"].geometry}
              material={materials.material}
              position={[21.125, 0, -19.021]}
              rotation={[0, -0.838, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_12_������_0"].geometry}
              material={materials.material}
              position={[27.035, 0, -8.784]}
              rotation={[0, -1.257, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_11_������_0"].geometry}
              material={materials.material}
              position={[28.27, 0, 2.971]}
              rotation={[-Math.PI, -1.466, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_10_������_0"].geometry}
              material={materials.material}
              position={[24.618, 0, 14.213]}
              rotation={[-Math.PI, -Math.PI / 3, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_9_������_0"].geometry}
              material={materials.material}
              position={[16.708, 0, 22.997]}
              rotation={[Math.PI, -Math.PI / 5, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_8_������_0"].geometry}
              material={materials.material}
              position={[5.91, 0, 27.805]}
              rotation={[-Math.PI, -0.209, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_7_������_0"].geometry}
              material={materials.material}
              position={[-5.91, 0, 27.805]}
              rotation={[-Math.PI, 0.209, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_6_������_0"].geometry}
              material={materials.material}
              position={[-16.708, 0, 22.997]}
              rotation={[-Math.PI, Math.PI / 5, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_5_������_0"].geometry}
              material={materials.material}
              position={[-24.618, 0, 14.213]}
              rotation={[Math.PI, Math.PI / 3, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_4_������_0"].geometry}
              material={materials.material}
              position={[-28.27, 0, 2.971]}
              rotation={[-Math.PI, 1.466, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_3_������_0"].geometry}
              material={materials.material}
              position={[-27.035, 0, -8.784]}
              rotation={[0, 1.257, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_2_2_������_0"].geometry}
              material={materials.material}
              position={[-21.125, 0, -19.021]}
              rotation={[0, 0.838, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_1_������_0"].geometry}
              material={materials.material}
              position={[-11.562, 0, -25.969]}
              rotation={[0, 0.419, 0]}
            />
          </group>
          <group
            position={[86.505, -136.382, 110.619]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <group position={[0, 30.354, 0]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["������_2_2_������1_0"].geometry}
                material={materials.material_1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes["������_2_2_������_0"].geometry}
                material={materials.material}
              />
            </group>
          </group>
          <group position={[97.905, 0, -177.104]} rotation={[0, 0.698, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_3_������1_0"].geometry}
              material={materials.material_1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_3_������_0"].geometry}
              material={materials.material}
            />
          </group>
          <group position={[154.665, -2.518, 124.735]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_4_������1_0"].geometry}
              material={materials.material_1}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_4_������_0"].geometry}
              material={materials.material}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������_������1_0"].geometry}
            material={materials.material_1}
            position={[21.07, -94.271, -173.274]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������_2_������1_0_1"].geometry}
            material={materials.material_1}
            position={[58.722, -75.345, 110.791]}
            rotation={[0, 0, -0.873]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������������_������1_0_1"].geometry}
            material={materials.material_1}
            position={[79.34, -99.579, 110.619]}
            rotation={[0, 0, -2.443]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["���������������_������1_0"].geometry}
          material={materials.material_1}
          position={[-2.252, -135.442, -102.704]}
          rotation={[1.5, 0, -Math.PI / 2]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["������_������1_0_3"].geometry}
          material={materials.material_1}
          position={[0, -15.428, 25.489]}
          rotation={[1.5, 0, 0]}
        />
      </group>
      <group
        position={[0.386, -0.286, -41.358]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <group position={[0, -15.428, 25.489]} rotation={[1.5, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������001_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              scale={[1, 3, 1]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_003_02_-_Default_0"].geometry}
            material={materials["02_-_Default"]}
            position={[0, 97.125, 0]}
            scale={[1, 1, 1.21]}
          />
        </group>
        <group position={[-0.836, 148.664, -109.803]} rotation={[1.5, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_003_02_-_Default_0_1"].geometry}
            material={materials["02_-_Default"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������001_02_-_Default_0_1"].geometry}
            material={materials["02_-_Default"]}
            rotation={[0, 0, Math.PI / 2]}
          />
        </group>
        <group position={[0, -274.093, 43.88]} rotation={[1.5, 0, 0]}>
          <group position={[0, 0, -4.247]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_003_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[0, 41.779, 4.135]}
              rotation={[Math.PI / 2, Math.PI / 2, 0]}
            />
          </group>
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["������001_02_-_Default_0_2"].geometry}
          material={materials["02_-_Default"]}
          position={[0, 204.904, 98.426]}
          rotation={[-1.964, 0, -Math.PI / 2]}
        />
        <group position={[0, -15.428, 25.489]} rotation={[1.5, 0, 0]}>
          <group position={[0, 18.143, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_003_02_-_Default_0_2"].geometry}
              material={materials["02_-_Default"]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������001_02_-_Default_0_3"].geometry}
              material={materials["02_-_Default"]}
              position={[0, 20.465, 0]}
            />
          </group>
          <group position={[0, 8.553, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_004_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������001_02_-_Default_0_4"].geometry}
              material={materials["02_-_Default"]}
              position={[0, 4.376, 0]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������001_02_-_Default_0_5"].geometry}
            material={materials["02_-_Default"]}
            position={[0, 20.944, 0]}
          />
          <group position={[0, 2.181, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_017_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[0, 0, -28.426]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_018_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[11.562, 0, -25.969]}
              rotation={[0, -0.419, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_019_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[21.125, 0, -19.021]}
              rotation={[0, -0.838, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_020_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[27.035, 0, -8.784]}
              rotation={[0, -1.257, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_021_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[28.27, 0, 2.971]}
              rotation={[-Math.PI, -1.466, -Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_022_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[24.618, 0, 14.213]}
              rotation={[-Math.PI, -Math.PI / 3, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_023_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[16.708, 0, 22.997]}
              rotation={[Math.PI, -Math.PI / 5, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_024_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[5.91, 0, 27.805]}
              rotation={[-Math.PI, -0.209, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_025_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-5.91, 0, 27.805]}
              rotation={[-Math.PI, 0.209, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_026_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-16.708, 0, 22.997]}
              rotation={[-Math.PI, Math.PI / 5, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_027_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-24.618, 0, 14.213]}
              rotation={[Math.PI, Math.PI / 3, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_028_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-28.27, 0, 2.971]}
              rotation={[-Math.PI, 1.466, Math.PI]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_029_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-27.035, 0, -8.784]}
              rotation={[0, 1.257, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_2_003_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-21.125, 0, -19.021]}
              rotation={[0, 0.838, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["���������_030_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[-11.562, 0, -25.969]}
              rotation={[0, 0.419, 0]}
            />
          </group>
          <group
            position={[86.505, -136.382, 110.619]}
            rotation={[0, 0, -Math.PI / 2]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes["������_2_003_02_-_Default_0"].geometry}
              material={materials["02_-_Default"]}
              position={[0, 30.354, 0]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_006_02_-_Default_0"].geometry}
            material={materials["02_-_Default"]}
            position={[97.905, 0, -177.104]}
            rotation={[0, 0.698, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["������_007_02_-_Default_0"].geometry}
            material={materials["02_-_Default"]}
            position={[154.665, -2.518, 124.735]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������001_02_-_Default_0"].geometry}
            material={materials["02_-_Default"]}
            position={[21.07, -94.271, -173.274]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������_016_02_-_Default_0"].geometry}
            material={materials["02_-_Default"]}
            position={[58.722, -75.345, 110.791]}
            rotation={[0, 0, -0.873]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["���������������001_02_-_Default_0_1"].geometry}
            material={materials["02_-_Default"]}
            position={[79.34, -99.579, 110.619]}
            rotation={[0, 0, -2.443]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["���������������001_02_-_Default_0"].geometry}
          material={materials["02_-_Default"]}
          position={[-2.252, -135.442, -102.704]}
          rotation={[1.5, 0, -Math.PI / 2]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes["������001_02_-_Default_0_6"].geometry}
          material={materials["02_-_Default"]}
          position={[0, -15.428, 25.489]}
          rotation={[1.5, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/cute_airplane.glb");
