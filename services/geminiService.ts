
import { GoogleGenAI } from "@google/genai";
import { Holon } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateHolonicReport(holons: Holon[]) {
  const summaryData = holons.map(h => ({
    name: h.name,
    type: h.type,
    avgProduction: h.history.reduce((acc, r) => acc + r.production, 0) / (h.history.length || 1),
    avgConsumption: h.history.reduce((acc, r) => acc + r.consumption, 0) / (h.history.length || 1),
    status: h.status,
    parentId: h.parentId
  }));

  const prompt = `
    Analyze the following energy simulation data from a Holonic Energy System.
    A Holonic System is a decentralized architecture where each unit (Holon) acts as both an autonomous whole and a cooperative part.
    
    Data Summary: ${JSON.stringify(summaryData)}
    
    Provide an executive summary including:
    1. Overall System Health and Efficiency.
    2. Identification of bottlenecks or energy waste (e.g. storage underutilization).
    3. Suggestions for optimizing the Holarchy (parent-child relationships).
    4. Predicting future stability based on current resiliency levels.
    
    Return the response as a structured markdown report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "Failed to generate report.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI service.";
  }
}

export async function predictStabilityChange(holon: Holon, oldParentName: string, newParentName: string, allHolons: Holon[]) {
  const prompt = `
    AS A GRID STABILITY AI:
    A user is moving the holon "${holon.name}" (Type: ${holon.type}, Capacity: ${holon.baseCapacity}kW) 
    from Parent: "${oldParentName}" to Parent: "${newParentName}".
    
    Current Grid Context: ${allHolons.map(h => `${h.name} (${h.type}, Status: ${h.status})`).join(", ")}
    
    Predict the stability impact of this "What-If" scenario. 
    Consider:
    1. Load balancing shift within the holarchy.
    2. Redundancy and single-point-of-failure risks.
    3. Potential for microgrid islanding efficiency.
    
    Keep the answer concise (max 3 sentences). Be technical and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.5 }
    });
    return response.text || "Assessment unavailable.";
  } catch (e) {
    return "Unable to predict impact at this time.";
  }
}
