import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";

actor {
  public type GoldenSignature = {
    id : Text;
    name : Text;
    category : Text;
    parameters : {
      temperature : Float;
      pressure : Float;
      holdTime : Float;
      feedRate : Float;
      coolingRate : Float;
    };
    objectives : {
      yieldPct : Float;
      qualityPct : Float;
      performancePct : Float;
      energyKwh : Float;
      carbonKg : Float;
    };
    status : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type BatchRecord = {
    id : Text;
    timestamp : Int;
    materialType : Text;
    batchSize : Float;
    machineId : Text;
    temperature : Float;
    pressure : Float;
    holdTime : Float;
    feedRate : Float;
    coolingRate : Float;
    yieldPct : Float;
    qualityPct : Float;
    performancePct : Float;
    energyKwh : Float;
    carbonKg : Float;
    deviationScore : Float;
    riskScore : Float;
    maintenanceAlertProb : Float;
  };

  public type Recommendation = {
    id : Text;
    batchId : Text;
    message : Text;
    confidence : Nat;
    status : Text;
    createdAt : Int;
  };

  public type OptimizationResult = {
    id : Text;
    temperature : Float;
    pressure : Float;
    holdTime : Float;
    feedRate : Float;
    coolingRate : Float;
    yieldPct : Float;
    qualityPct : Float;
    performancePct : Float;
    energyKwh : Float;
    carbonKg : Float;
    isGolden : Bool;
  };

  public type EnergyPattern = {
    timestamp : Int;
    energyKwh : Float;
    isAnomaly : Bool;
    equipmentHealthScore : Float;
    explanation : Text;
  };

  public type CarbonMetric = {
    date : Int;
    actualCarbon : Float;
    targetCarbon : Float;
    regulationLimit : Float;
  };

  public type BusinessMetric = {
    energySavedKwh : Float;
    carbonReducedKg : Float;
    costSavedUSD : Float;
    efficiencyGainPct : Float;
    totalBatchesOptimized : Nat;
    roiPct : Float;
  };

  public type ShapValue = {
    paramName : Text;
    shapValue : Float;
    impact : Text;
    direction : Text;
    description : Text;
  };

  public type Scenario = {
    id : Text;
    name : Text;
    parameters : {
      temperature : Float;
      pressure : Float;
      holdTime : Float;
      feedRate : Float;
      coolingRate : Float;
    };
  };

  module GoldenSignature {
    public func compare(g1 : GoldenSignature, g2 : GoldenSignature) : Order.Order {
      Text.compare(g1.id, g2.id);
    };
  };

  let goldenSignatures = Map.empty<Text, GoldenSignature>();
  let batchRecords = Map.empty<Text, BatchRecord>();
  let recommendations = Map.empty<Text, Recommendation>();
  let optimizationResults = Map.empty<Text, OptimizationResult>();
  let scenarios = Map.empty<Text, Scenario>();

  // GOLDEN SIGNATURES
  public shared ({ caller }) func createSignature(signature : GoldenSignature) : async () {
    goldenSignatures.add(signature.id, signature);
  };

  public query ({ caller }) func getSignatures() : async [GoldenSignature] {
    goldenSignatures.values().toArray().sort();
  };

  public query ({ caller }) func getSignatureById(id : Text) : async GoldenSignature {
    switch (goldenSignatures.get(id)) {
      case (null) { Runtime.trap("Signature not found") };
      case (?signature) { signature };
    };
  };

  public shared ({ caller }) func updateSignatureStatus(id : Text, status : Text) : async () {
    switch (goldenSignatures.get(id)) {
      case (null) { Runtime.trap("Signature not found") };
      case (?signature) {
        let updated : GoldenSignature = {
          id = signature.id;
          name = signature.name;
          category = signature.category;
          parameters = signature.parameters;
          objectives = signature.objectives;
          status;
          createdAt = signature.createdAt;
          updatedAt = Time.now();
        };
        goldenSignatures.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteSignature(id : Text) : async () {
    goldenSignatures.remove(id);
  };

  // BATCH RECORDS
  public shared ({ caller }) func storeBatch(batch : BatchRecord) : async () {
    batchRecords.add(batch.id, batch);
  };

  public query ({ caller }) func getBatches() : async [BatchRecord] {
    batchRecords.values().toArray();
  };

  public query ({ caller }) func getBatchById(id : Text) : async BatchRecord {
    switch (batchRecords.get(id)) {
      case (null) { Runtime.trap("Batch not found") };
      case (?batch) { batch };
    };
  };

  // RECOMMENDATIONS
  public shared ({ caller }) func acceptRecommendation(id : Text) : async () {
    switch (recommendations.get(id)) {
      case (null) { Runtime.trap("Recommendation not found") };
      case (?rec) {
        let updated : Recommendation = {
          id = rec.id;
          batchId = rec.batchId;
          message = rec.message;
          confidence = rec.confidence;
          status = "Accepted";
          createdAt = rec.createdAt;
        };
        recommendations.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func rejectRecommendation(id : Text) : async () {
    switch (recommendations.get(id)) {
      case (null) { Runtime.trap("Recommendation not found") };
      case (?rec) {
        let updated : Recommendation = {
          id = rec.id;
          batchId = rec.batchId;
          message = rec.message;
          confidence = rec.confidence;
          status = "Rejected";
          createdAt = rec.createdAt;
        };
        recommendations.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func modifyRecommendation(id : Text, newMessage : Text) : async () {
    switch (recommendations.get(id)) {
      case (null) { Runtime.trap("Recommendation not found") };
      case (?rec) {
        let updated : Recommendation = {
          id = rec.id;
          batchId = rec.batchId;
          message = newMessage;
          confidence = rec.confidence;
          status = "Modified";
          createdAt = rec.createdAt;
        };
        recommendations.add(id, updated);
      };
    };
  };

  // WHAT-IF SCENARIOS
  public shared ({ caller }) func saveScenario(name : Text, params : Scenario) : async () {
    scenarios.add(name, params);
  };

  public query ({ caller }) func getScenarios() : async [Scenario] {
    scenarios.values().toArray();
  };

  public query ({ caller }) func compareScenarios(id1 : Text, id2 : Text) : async (Scenario, Scenario) {
    let s1 = switch (scenarios.get(id1)) {
      case (null) { Runtime.trap("Scenario not found") };
      case (?s) { s };
    };
    let s2 = switch (scenarios.get(id2)) {
      case (null) { Runtime.trap("Scenario not found") };
      case (?s) { s };
    };
    (s1, s2);
  };
};
