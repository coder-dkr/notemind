'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Brain, Target, AlertTriangle, Heart, Lightbulb, CheckCircle, Compass } from 'lucide-react';
import { CognitiveNode, CognitiveEdge } from '@/types/supabase';
import { getNodeColor, getEdgeColor } from '@/lib/cognitive-engine';

interface CognitiveMapProps {
  nodes: CognitiveNode[];
  edges: CognitiveEdge[];
}

const nodeTypeIcons: Record<string, React.ReactNode> = {
  belief: <Brain className="w-4 h-4" />,
  goal: <Target className="w-4 h-4" />,
  fear: <AlertTriangle className="w-4 h-4" />,
  value: <Heart className="w-4 h-4" />,
  assumption: <Lightbulb className="w-4 h-4" />,
  decision: <CheckCircle className="w-4 h-4" />,
  intention: <Compass className="w-4 h-4" />,
};

// Custom node component
function CognitiveNodeComponent({ data }: { data: { label: string; type: string; confidence: number } }) {
  const color = getNodeColor(data.type as CognitiveNode['node_type']);
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="px-4 py-3 rounded-2xl border-2 min-w-[150px] max-w-[250px] backdrop-blur-xl"
      style={{ 
        borderColor: color,
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {nodeTypeIcons[data.type]}
        </div>
        <span 
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color }}
        >
          {data.type}
        </span>
      </div>
      <p className="text-sm font-medium text-white/80 leading-tight">
        {data.label}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${data.confidence * 100}%`,
              backgroundColor: color 
            }}
          />
        </div>
        <span className="text-[10px] text-white/40 font-bold">
          {Math.round(data.confidence * 100)}%
        </span>
      </div>
    </motion.div>
  );
}

const nodeTypes = {
  cognitive: CognitiveNodeComponent,
};

export function CognitiveMap({ nodes: cognitiveNodes, edges: cognitiveEdges }: CognitiveMapProps) {
  const [mounted, setMounted] = useState(false);

  // Convert cognitive nodes to ReactFlow nodes
  const initialNodes = useMemo((): Node[] => {
    // Create a circular layout
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    
    return cognitiveNodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / cognitiveNodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return {
        id: node.id,
        type: 'cognitive',
        position: { x, y },
        data: {
          label: node.content,
          type: node.node_type,
          confidence: node.confidence,
        },
      };
    });
  }, [cognitiveNodes]);

  // Convert cognitive edges to ReactFlow edges
  const initialEdges = useMemo((): Edge[] => {
    return cognitiveEdges.map((edge) => ({
      id: edge.id,
      source: edge.source_node_id,
      target: edge.target_node_id,
      animated: edge.edge_type === 'conflicts',
      style: { 
        stroke: getEdgeColor(edge.edge_type),
        strokeWidth: 2 + edge.strength * 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: getEdgeColor(edge.edge_type),
      },
      label: edge.edge_type.replace('_', ' '),
      labelStyle: { 
        fontSize: 10, 
        fontWeight: 600,
        fill: getEdgeColor(edge.edge_type),
      },
      labelBgStyle: { 
        fill: '#0d0221',
        fillOpacity: 0.8,
      },
    }));
  }, [cognitiveEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white/40 font-bold">Loading cognitive map...</div>
      </div>
    );
  }

  if (cognitiveNodes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
          <Brain className="w-12 h-12 text-white/20" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">No cognitive nodes yet</h3>
          <p className="text-white/40 max-w-md">
            Start capturing thoughts to build your cognitive map. Each thought will be analyzed 
            and its concepts will appear here as nodes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-[#0a0118]"
      >
        <Background color="#ffffff10" gap={20} />
        <Controls 
          className="bg-white/5 border-white/10 rounded-xl"
          style={{ button: { backgroundColor: '#ffffff10', borderColor: '#ffffff20' } }}
        />
        <Panel position="top-left" className="glass rounded-2xl p-4 border-white/5">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Node Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(nodeTypeIcons).map(([type, icon]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: getNodeColor(type as CognitiveNode['node_type']) }}
                  >
                    {icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
