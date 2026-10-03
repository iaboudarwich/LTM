// src/data/road-signs.ts
// ============================================================================
// ROAD SIGNS DATA — the ONE file to edit for the Road Signs page.
// ============================================================================
// Source: liberiatraffic.com — official LTM "Signals, Signs and Pavement
// Markings" reference. Descriptions are copied verbatim from the source.
//
// HOW TO ADD A NEW SIGN:
//   1. Put the sign image in:  public/signs/  (WebP, e.g. my-sign.webp — convert
//      PNGs with: npx sharp -i in.png -o public/signs/ -f webp -q 80)
//   2. Add an entry to the `roadSigns` array below.
//   3. Set `imageUrl` to the file path, e.g.  imageUrl: "/signs/my-sign.webp"
//      (leave it as ""  if there is no image — a labeled placeholder shows.)
//   4. Set `section` to one of the SignSection values (controls which group
//      the sign appears under). `imageHint` is a short alt-text style hint.
//   5. Set `liberiaSpecific: true` only for rules unique to Liberia.
//   To EDIT a sign, change its fields. To REMOVE one, delete its entry.
//
// Section headings and intros are defined in `sectionMeta` just below.
// ============================================================================

export type SignSection =
  | "traffic-signals"
  | "sign-shapes"
  | "regulatory"
  | "warning"
  | "work-zone"
  | "pavement-markings";

export type RoadSign = {
  id: string;
  name: string;
  section: SignSection;
  description: string;
  imageUrl: string; // local path: /signs/<id>.webp or "" for fallback
  imageHint: string;
  liberiaSpecific?: boolean;
};

export const sectionMeta: Record<
  SignSection,
  { title: string; intro: string; order: number }
> = {
  "traffic-signals": {
    order: 1,
    title: "Traffic Signals",
    intro:
      "Traffic signals apply to drivers, motorcycle riders, bicyclists, moped-riders and pedestrians. Obey all signs and signals unless directed by a police officer; always follow the officer's direction.",
  },
  "sign-shapes": {
    order: 2,
    title: "Sign Colors and Shapes",
    intro:
      "The color and shape of a traffic sign communicates important information about the sign's message. In poor visibility conditions, such as heavy fog, you may be able to make out only the shape of a sign. As you approach a sign and while still distant, you may see the color long before you can read the message or see the symbol, giving you some advance information.",
  },
  regulatory: {
    order: 3,
    title: "Regulatory Signs",
    intro:
      "Regulatory signs inform you of the law; you must obey their instructions. Remember that a red circle with a slash means NO. The symbol inside the circle tells you what is prohibited.",
  },
  warning: {
    order: 4,
    title: "Warning Signs",
    intro:
      "Warning signs alert you to possible hazards ahead. Slow down and watch for other pavement markings, signs, signals or work zones that may follow.",
  },
  "work-zone": {
    order: 5,
    title: "Work Zone & Railroad Signs",
    intro:
      "In a work zone, the lives of highway workers depend on drivers like you obeying the posted speed limits and avoiding distractions. If you are convicted of exceeding the speed limit in a highway work zone, you may be fined up to US$500. If you are convicted of using a handheld communications device in a highway work zone, you will be fined US$250. Remember, the color orange marks a work zone and means slow down and be alert.",
  },
  "pavement-markings": {
    order: 6,
    title: "Pavement Markings",
    intro:
      "Road markings guide and warn drivers as well as regulate traffic. Markings may be red, yellow or white. They may be used alone or in combinations. Each has a different meaning.",
  },
};

export const roadSigns: RoadSign[] = [
  // ── TRAFFIC SIGNALS ──
  {
    id: "red-light",
    name: "Red Light",
    section: "traffic-signals",
    description:
      "At a red light, come to a complete stop at the stop line or, if there is no stop line, before entering the intersection or before reaching the crosswalk. Remain stopped as long as the signal is red, unless turns are allowed.",
    imageUrl: "/signs/red-light.webp",
    imageHint: "solid red traffic light",
  },
  {
    id: "right-turn-on-red",
    name: "Right Turn on Red",
    section: "traffic-signals",
    description:
      "You may turn right while the traffic signal displays a red light. Before turning, you must come to a complete stop. Look both ways and yield the right-of-way to pedestrians and other traffic. Be sure to check for less visible vehicles such as motorcycles, bicycles and mopeds. You may not turn right on red if signs are posted at the intersection that read 'No Turn on Red,' or if a red arrow pointing to the right is displayed.",
    imageUrl: "/signs/red-light.webp",
    imageHint: "right turn arrow on red signal",
  },
  {
    id: "left-turn-on-red",
    name: "Left Turn on Red",
    section: "traffic-signals",
    description:
      "You may turn left at a red light if you are on a one-way street and turning left onto another one-way street while the traffic signal displays a red light. Before turning, you must come to a complete stop. Look both ways and yield the right-of-way to pedestrians and other traffic. Be sure to check for less visible vehicles such as motorcycles, bicycles, and mopeds. You may not turn left on red if signs are posted at the intersection that read 'No Turn on Red,' or if a red arrow pointing to the left is displayed.",
    imageUrl: "/signs/red-light.webp",
    imageHint: "left turn arrow on red signal",
  },
  {
    id: "red-arrow",
    name: "Red Arrow",
    section: "traffic-signals",
    description:
      "A red arrow means you must stop if you intend to move in the direction of the arrow. You may not proceed in the direction of the arrow as long as the red arrow is displayed, unless signs are posted at the intersection that read 'Right on Red Arrow After Stop' or 'Left on Red Arrow After Stop.' Liberia law prohibits right and left turns at red arrow lights.",
    imageUrl: "/signs/red-arrow.webp",
    imageHint: "red left arrow traffic signal",
    liberiaSpecific: true,
  },
  {
    id: "flashing-red-light",
    name: "Flashing Red Light",
    section: "traffic-signals",
    description:
      "At a flashing red light, come to a complete stop and yield to oncoming vehicles and pedestrians. You may go when the way is clear. At a railroad crossing, you must come to a complete stop even if you don't see a train.",
    imageUrl: "/signs/flashing-red-light.webp",
    imageHint: "flashing red traffic light",
  },
  {
    id: "flashing-red-arrow",
    name: "Flashing Red Arrow",
    section: "traffic-signals",
    description:
      "At a flashing red arrow, come to a complete stop, yield the right-of-way to vehicles coming from the other direction and pedestrians in the intersection, and proceed in the direction of the arrow when the way is clear.",
    imageUrl: "/signs/red-arrow.webp",
    imageHint: "flashing red arrow signal",
  },
  {
    id: "yellow-light",
    name: "Yellow Light or Arrow",
    section: "traffic-signals",
    description:
      "A yellow light or arrow are cautions warning that the light is about to change. If you have not entered the intersection, stop; or, if unsafe to stop, cautiously go through it. If you are already in the intersection, go through it cautiously. Do not speed up to beat the light.",
    imageUrl: "/signs/yellow-light.webp",
    imageHint: "solid yellow traffic light",
  },
  {
    id: "flashing-yellow-light",
    name: "Flashing Yellow Light",
    section: "traffic-signals",
    description:
      "A flashing yellow light means slow down and proceed with caution. Flashing yellow lights are at locations with higher-than-normal hazardous conditions.",
    imageUrl: "/signs/flashing-yellow-light.webp",
    imageHint: "flashing yellow traffic light",
  },
  {
    id: "flashing-yellow-arrow",
    name: "Flashing Yellow Arrow",
    section: "traffic-signals",
    description:
      "At a flashing yellow arrow, you may turn in the direction of the arrow, if the way is clear. Yield the right-of-way to vehicles coming from the other direction and pedestrians in the intersection. Be sure to check for less visible vehicles such as motorcycles, bicycles, and mopeds. If a traffic light changes from red to flashing yellow arrow while a pedestrian is in the intersection, allow the pedestrian to cross the street before turning.",
    imageUrl: "/signs/yellow-light.webp",
    imageHint: "flashing yellow arrow signal",
  },
  {
    id: "green-light",
    name: "Green Light or Arrow",
    section: "traffic-signals",
    description:
      "At a green light, you may go if the way is clear. At a green arrow, you may go in the direction of the arrow if the way is clear. If you are turning without a green arrow, you must yield the right-of-way to vehicles coming from the other direction and pedestrians in the intersection. Be sure to check for less visible vehicles such as motorcycles, bicycles, and mopeds. If a traffic light changes from red to green while a pedestrian is in the street, allow the pedestrian to cross the street before turning.",
    imageUrl: "/signs/green-light.webp",
    imageHint: "solid green traffic light",
  },
  {
    id: "out-of-service-signals",
    name: "Out of Service Signals",
    section: "traffic-signals",
    description:
      "When traffic signals are not working because of a power outage or other problem and not displaying any lights, you are required to stop, proceeding through the intersection as though it were an all-way stop. This does not apply if a law enforcement officer or other authorized person is directing traffic at the intersection, or if portable stop signs are in use.",
    imageUrl: "/signs/out-of-service-signals.webp",
    imageHint: "dark traffic signal",
  },
  {
    id: "lane-use-red-x",
    name: "Lane Use Signal: Red X",
    section: "traffic-signals",
    description: "Never drive in a lane marked with a red X signal.",
    imageUrl: "/signs/lane-use-red-x.webp",
    imageHint: "red X overhead lane signal",
  },
  {
    id: "lane-use-yellow-x",
    name: "Lane Use Signal: Yellow X or Diagonal Arrow",
    section: "traffic-signals",
    description:
      "These signals mean that you should move out of the lane as soon as safely possible.",
    imageUrl: "/signs/lane-use-yellow-x.webp",
    imageHint: "yellow X overhead lane signal",
  },
  {
    id: "lane-use-green-arrow",
    name: "Lane Use Signal: Green Arrow",
    section: "traffic-signals",
    description:
      "You are permitted to drive in a lane marked with a green arrow signal.",
    imageUrl: "/signs/lane-use-green-arrow.webp",
    imageHint: "green down arrow overhead lane signal",
  },
  {
    id: "lane-use-left-turn-arrow",
    name: "Lane Use Signal: Left-turn Arrow",
    section: "traffic-signals",
    description:
      "You are permitted to enter in a lane marked with a one-way or two-way arrow only to turn in the direction of the arrow.",
    imageUrl: "/signs/lane-use-left-turn-arrow.webp",
    imageHint: "white left turn arrow lane signal",
  },
  {
    id: "pedestrian-hybrid-beacon",
    name: "Pedestrian Hybrid Beacons (PHBs)",
    section: "traffic-signals",
    description:
      "PHBs appear over intersections without stoplights and alert drivers when pedestrians are at a crosswalk. One yellow light at the bottom flashes when a pedestrian activates the PHB. Next, the yellow light turns solid to alert drivers to prepare to stop. Then, the top two red lights on the PHB turn solid while a walk signal appears at the crosswalk, and drivers must stop. Lastly, while the walk signal counts down for the pedestrians, the PHB's two red lights alternate flashing, telling the driver that if the crosswalk is now clear, they may proceed with caution.",
    imageUrl: "/signs/pedestrian-hybrid-beacon.webp",
    imageHint: "pedestrian hybrid beacon assembly",
  },

  // ── SIGN SHAPES ──
  {
    id: "shape-octagon",
    name: "Octagon: Stop",
    section: "sign-shapes",
    description:
      "This eight-sided shape always means stop. You must come to a complete stop at the sign, stop line, pedestrian crosswalk or curb. Wait for any vehicle or pedestrian to clear the way. At some intersections you'll find a sign beneath the stop sign that reads 'All Way' or '4 Way.' At these intersections all vehicles on all roads leading into the intersection must stop. If you get to the intersection at the same time as other vehicles, the driver on the left must yield to the driver on the right.",
    imageUrl: "/signs/shape-octagon.webp",
    imageHint: "red octagonal stop sign",
  },
  {
    id: "shape-triangle",
    name: "Triangle: Yield",
    section: "sign-shapes",
    description:
      "You must slow down as you come to the intersection. Be prepared to stop. Let any vehicles, pedestrians or bicyclists safely pass before you proceed.",
    imageUrl: "/signs/shape-triangle.webp",
    imageHint: "red and white inverted triangle yield sign",
  },
  {
    id: "shape-rectangle",
    name: "Rectangle: Regulatory or Guide",
    section: "sign-shapes",
    description:
      "Vertical signs generally give instructions or tell you the law. Horizontal signs may give directions or information.",
    imageUrl: "/signs/shape-rectangle.webp",
    imageHint: "white and green rectangular signs",
  },
  {
    id: "shape-diamond",
    name: "Diamond: Warning",
    section: "sign-shapes",
    description:
      "These signs warn you of special conditions or hazards ahead. Slow down and drive with caution. Be ready to stop.",
    imageUrl: "/signs/shape-diamond.webp",
    imageHint: "yellow diamond warning sign",
  },
  {
    id: "shape-pentagon",
    name: "Pentagon: School Zone / School Crossing",
    section: "sign-shapes",
    description:
      "This five-sided shape marks school zones and warns you about school crossings. Two signs may be used together to show the actual location of the crosswalk.",
    imageUrl: "/signs/shape-pentagon.webp",
    imageHint: "yellow-green pentagon school crossing",
  },

  // ── REGULATORY ──
  {
    id: "speed-limit",
    name: "Speed Limit",
    section: "regulatory",
    description:
      "These signs tell you the maximum legal speed that you may drive on the road where the sign is posted when weather conditions are good. Some roads have electronic speed limit signs that change based on weather or traffic conditions. During rain, snow and ice, you may receive a ticket for driving too fast for the conditions even if you are driving at or less than the posted speed limit.",
    imageUrl: "/signs/speed-limit.webp",
    imageHint: "speed limit 55 sign",
  },
  {
    id: "do-not-enter",
    name: "Do Not Enter / Wrong Way",
    section: "regulatory",
    description:
      "These signs mean you cannot drive in that direction. If you drive past these signs you are going in the wrong direction and could get into a head-on crash with vehicles headed your way. Immediately slow down, pull over, and cautiously turn around.",
    imageUrl: "/signs/do-not-enter.webp",
    imageHint: "DO NOT ENTER and WRONG WAY signs",
  },
  {
    id: "one-way",
    name: "One Way",
    section: "regulatory",
    description: "Traffic flows only in the direction of the arrow.",
    imageUrl: "/signs/one-way.webp",
    imageHint: "ONE WAY arrow sign",
  },
  {
    id: "no-left-turn",
    name: "No Left Turn",
    section: "regulatory",
    description:
      "Left turns are against the law. In Liberia, U-turns are considered as two left turns and are illegal if this sign is posted.",
    imageUrl: "/signs/no-left-turn.webp",
    imageHint: "no left turn sign with red slash",
    liberiaSpecific: true,
  },
  {
    id: "no-right-turn",
    name: "No Right Turn",
    section: "regulatory",
    description:
      "Right turns are illegal. Do not make a right turn when you see this sign.",
    imageUrl: "/signs/no-right-turn.webp",
    imageHint: "no right turn sign with red slash",
  },
  {
    id: "no-u-turn",
    name: "No U-Turn",
    section: "regulatory",
    description:
      "U-turns are illegal. Do not make a U-turn when you see this sign.",
    imageUrl: "/signs/no-u-turn.webp",
    imageHint: "no U-turn sign with red slash",
  },
  {
    id: "no-turn-on-red",
    name: "No Turn on Red",
    section: "regulatory",
    description:
      "You may not turn on the red light. Wait for the signal to turn green.",
    imageUrl: "/signs/no-turn-on-red.webp",
    imageHint: "NO TURN ON RED text sign",
  },
  {
    id: "do-not-pass",
    name: "Do Not Pass",
    section: "regulatory",
    description:
      "This sign marks the beginning of a no passing zone. You may not pass cars ahead of you in your lane, even if the way is clear.",
    imageUrl: "/signs/do-not-pass.webp",
    imageHint: "DO NOT PASS rectangle sign",
  },
  {
    id: "left-turn-yield-on-green",
    name: "Left Turn Yield on Green",
    section: "regulatory",
    description:
      "This sign is used with a traffic signal. It tells you that the traffic turning left at a green light does not have the right-of-way and must yield to traffic coming from the other direction. Stop and look for oncoming traffic, then proceed with caution.",
    imageUrl: "/signs/left-turn-yield-on-green.webp",
    imageHint: "LEFT TURN YIELD ON GREEN sign with green dot",
  },
  {
    id: "keep-right",
    name: "Keep Right",
    section: "regulatory",
    description:
      "A traffic island, median or barrier is ahead. Keep to the side indicated by the arrow.",
    imageUrl: "/signs/keep-right.webp",
    imageHint: "keep right arrow sign",
  },
  {
    id: "lane-use-control",
    name: "Lane Use Control",
    section: "regulatory",
    description:
      "These signs are used where turns are required or where special turning movements are permitted for specific lanes. Traffic in the lane must turn in the direction of the arrow.",
    imageUrl: "/signs/lane-use-control.webp",
    imageHint: "ONLY left and combination turn arrow signs",
  },
  {
    id: "hov",
    name: "High Occupancy Vehicle (HOV)",
    section: "regulatory",
    description:
      "These signs indicate lanes reserved for buses and vehicles with a driver and one or more passengers as specified on the sign.",
    imageUrl: "/signs/hov.webp",
    imageHint: "HOV 2+ lane sign",
  },
  {
    id: "disabled-parking",
    name: "Disabled Parking",
    section: "regulatory",
    description:
      "Parking spaces marked with these signs are reserved for people with disabled parking permits.",
    imageUrl: "/signs/disabled-parking.webp",
    imageHint: "blue and white disabled parking sign",
  },

  // ── WARNING ──
  {
    id: "advisory-speed",
    name: "Advisory Speed",
    section: "warning",
    description:
      "This sign indicates the maximum safe speed for a highway exit.",
    imageUrl: "/signs/advisory-speed.webp",
    imageHint: "exit advisory speed 25 MPH sign",
  },
  {
    id: "reduced-speed-ahead",
    name: "Reduced Speed Limit Ahead",
    section: "warning",
    description:
      "Prepare to reduce your speed; the speed limit is changing ahead.",
    imageUrl: "/signs/reduced-speed-ahead.webp",
    imageHint: "reduced speed limit ahead diamond sign",
  },
  {
    id: "stop-yield-ahead",
    name: "Stop Ahead / Yield Ahead",
    section: "warning",
    description:
      "A stop sign or yield sign is ahead. Slow down and be ready to stop.",
    imageUrl: "/signs/stop-yield-ahead.webp",
    imageHint: "stop ahead and yield ahead diamond signs",
  },
  {
    id: "signal-ahead",
    name: "Signal Ahead",
    section: "warning",
    description:
      "There is a traffic light signal ahead on the road you are on. Be ready to stop.",
    imageUrl: "/signs/signal-ahead.webp",
    imageHint: "diamond sign with traffic light symbol",
  },
  {
    id: "no-passing-zone",
    name: "No Passing Zone",
    section: "warning",
    description:
      "This sign marks the beginning of a no passing zone. You may not pass cars ahead of you in your lane, even if the way is clear.",
    imageUrl: "/signs/no-passing-zone.webp",
    imageHint: "yellow pennant NO PASSING ZONE sign",
  },
  {
    id: "merge",
    name: "Merge",
    section: "warning",
    description:
      "Two lanes of traffic moving in the same direction are about to become one. Drivers in both lanes are responsible for merging safely. Traffic from another road may be entering the road you are on. Be prepared for vehicles to move into your lane.",
    imageUrl: "/signs/merge.webp",
    imageHint: "merge diamond sign with merging arrows",
  },
  {
    id: "lane-reduction",
    name: "Lane Reduction",
    section: "warning",
    description:
      "The right lane ends soon. Drivers in the right lane must merge left when space opens up. Drivers in the left lane should allow other vehicles to merge smoothly.",
    imageUrl: "/signs/lane-reduction.webp",
    imageHint: "lane reduction diamond sign",
  },
  {
    id: "divided-highway-begins",
    name: "Divided Highway Begins",
    section: "warning",
    description:
      "The highway ahead is split into two separate roadways by a median or divider and each roadway is one-way. Keep right. The road will soon become two-way traffic divided by a median or barrier.",
    imageUrl: "/signs/divided-highway-begins.webp",
    imageHint: "divided highway begins diamond sign",
  },
  {
    id: "divided-highway-ends",
    name: "Divided Highway Ends",
    section: "warning",
    description:
      "The highway ahead no longer has a median or divider. Traffic goes in both directions. Keep right.",
    imageUrl: "/signs/divided-highway-ends.webp",
    imageHint: "divided highway ends diamond sign",
  },
  {
    id: "slippery-when-wet",
    name: "Slippery When Wet",
    section: "warning",
    description:
      "When pavement is wet, reduce your speed. Do not brake hard or change direction suddenly. Increase the distance between your car and the one ahead of you. The road ahead becomes unusually slippery in wet weather. Drive carefully in these conditions.",
    imageUrl: "/signs/slippery-when-wet.webp",
    imageHint: "slippery when wet diamond sign",
  },
  {
    id: "low-clearance",
    name: "Low Clearance",
    section: "warning",
    description:
      "The overpass ahead has a low clearance. Do not proceed if your vehicle is taller than the height shown on the sign.",
    imageUrl: "/signs/low-clearance.webp",
    imageHint: "low clearance diamond sign with height",
  },
  {
    id: "hill",
    name: "Hill",
    section: "warning",
    description: "A steep grade is ahead. Check your brakes.",
    imageUrl: "/signs/hill.webp",
    imageHint: "hill diamond warning sign",
  },
  {
    id: "deer-crossing",
    name: "Deer Crossing",
    section: "warning",
    description:
      "Deer cross the roadway in this area. Slow down, be alert and be ready to stop.",
    imageUrl: "/signs/deer-crossing.webp",
    imageHint: "deer crossing diamond sign",
  },
  {
    id: "horse-drawn-buggies",
    name: "Horse-Drawn Buggies",
    section: "warning",
    description:
      "Regularly travel in this area. Slow down and don't use the horn. State law requires motorists to pass with at least three feet of clearance when the way is clear.",
    imageUrl: "/signs/horse-drawn-buggies.webp",
    imageHint: "horse-drawn buggy diamond sign",
  },
  {
    id: "tractors-farm-equipment",
    name: "Tractors and Farm Equipment",
    section: "warning",
    description:
      "Regularly travel in this area. Be ready to slow down or stop. Only pass when the way is clear.",
    imageUrl: "/signs/tractors-farm-equipment.webp",
    imageHint: "tractor warning diamond sign",
  },
  {
    id: "pedestrian-crossing",
    name: "Pedestrian Crossing",
    section: "warning",
    description:
      "Watch for people who are walking, riding bicycles or other devices entering a crosswalk or crossing your path. Slow down and be prepared to stop. A second sign with an arrow may show the actual location of the crosswalk.",
    imageUrl: "/signs/pedestrian-crossing.webp",
    imageHint: "yellow-green pedestrian crossing pentagon",
  },
  {
    id: "bicycle-crossing",
    name: "Bicycle Crossing / Bike Path",
    section: "warning",
    description:
      "Bicycles regularly cross or ride beside traffic in this area. Drive with caution. A second sign with an arrow may show the actual location of the bike crossing.",
    imageUrl: "/signs/bicycle-crossing.webp",
    imageHint: "yellow-green bicycle crossing diamond",
  },
  {
    id: "school-zone",
    name: "School Zone / School Crossing",
    section: "warning",
    description:
      "Watch out for children crossing the street or playing. Be ready to slow down or stop at school zones and surrounding areas. Obey the speed limit and signals from crossing guards. A second sign with an arrow may show the actual location of the sidewalk. NOTE: This sign is being transitioned to neon green. This transition will take effect within the next 10 years.",
    imageUrl: "/signs/school-zone.webp",
    imageHint: "yellow-green pentagon school crossing sign",
    liberiaSpecific: true,
  },
  {
    id: "open-joints",
    name: "Open Joints on Bridge",
    section: "warning",
    description:
      "Slow down. Open joints on bridges or ramps could cause a motorcyclist to lose control of the motorcycle.",
    imageUrl: "/signs/open-joints.webp",
    imageHint: "open joints on bridge sign",
  },
  {
    id: "expansion-joints",
    name: "Expansion Joints",
    section: "warning",
    description:
      "This sign is used when a joint across lanes creates a bump or is wide enough to cause loss of traction in wet weather.",
    imageUrl: "/signs/expansion-joints.webp",
    imageHint: "expansion joints sign",
  },
  {
    id: "intersection",
    name: "Intersection",
    section: "warning",
    description:
      "An intersection is ahead. Be alert for vehicles entering the road on which you are traveling. Another road crosses the road you are on. Watch carefully for traffic crossing your path.",
    imageUrl: "/signs/intersection.webp",
    imageHint: "cross intersection diamond sign",
  },
  {
    id: "y-intersection",
    name: "Y Intersection",
    section: "warning",
    description: "You must bear either right or left ahead.",
    imageUrl: "/signs/y-intersection.webp",
    imageHint: "Y intersection diamond sign",
  },
  {
    id: "t-intersection",
    name: "T Intersection",
    section: "warning",
    description:
      "The roadway you are traveling on ends ahead at a stop sign. You must turn right or left after yielding to oncoming traffic and pedestrians.",
    imageUrl: "/signs/t-intersection.webp",
    imageHint: "T intersection diamond sign",
  },
  {
    id: "roundabout",
    name: "Roundabout",
    section: "warning",
    description:
      "These signs indicate a circular intersection with an island in the center is ahead. Also called traffic circles, these intersections may have one or more lanes. Entering traffic must yield the right-of-way to traffic already in the circle and travel in a counter clockwise direction.",
    imageUrl: "/signs/roundabout.webp",
    imageHint: "roundabout diamond sign with circular arrows",
  },
  {
    id: "right-curve-side-road",
    name: "Right Curve with Side Road",
    section: "warning",
    description:
      "The road ahead curves right and a side road joins from the left within the curve. Be alert for vehicles entering the roadway you are traveling on.",
    imageUrl: "/signs/right-curve-side-road.webp",
    imageHint: "right curve with side road diamond sign",
  },
  {
    id: "sharp-right-turn",
    name: "Sharp Right Turn",
    section: "warning",
    description:
      "Slow down and be prepared for a sharp right turn in the road ahead.",
    imageUrl: "/signs/sharp-right-turn.webp",
    imageHint: "sharp right turn diamond sign with right angle arrow",
  },
  {
    id: "sharp-right-left-turns",
    name: "Sharp Right and Left Turns",
    section: "warning",
    description:
      "Slow down and be prepared for the road ahead to turn sharply right, then left.",
    imageUrl: "/signs/sharp-right-left-turns.webp",
    imageHint: "sharp right and left turns zigzag diamond sign",
  },
  {
    id: "right-and-left-curves",
    name: "Right and Left Curves",
    section: "warning",
    description: "The road ahead curves right, then left. Slow down.",
    imageUrl: "/signs/right-and-left-curves.webp",
    imageHint: "right and left curves S-shape diamond sign",
  },
  {
    id: "right-curve-safe-speed",
    name: "Right Curve with Safe Speed Indicator",
    section: "warning",
    description:
      "The road ahead curves right. Slow down to the safe speed indicated. A curve sign is used to warn of a curve where the recommended speed is less than the posted speed limit for the highway.",
    imageUrl: "/signs/right-curve-safe-speed.webp",
    imageHint: "curve sign with 35 MPH speed advisory",
  },
  {
    id: "winding-road",
    name: "Winding Road",
    section: "warning",
    description:
      "The road ahead winds with a series of turns or curves. On all curves, slow down for better control.",
    imageUrl: "/signs/winding-road.webp",
    imageHint: "winding road S-curves diamond sign",
  },
  {
    id: "low-ground-railroad-crossing",
    name: "Low Ground Railroad Crossing",
    section: "warning",
    description:
      "A steep slope where the railroad tracks cross the road may cause the bottom of low vehicles to get caught or drag on the tracks.",
    imageUrl: "/signs/low-ground-railroad.webp",
    imageHint: "low ground railroad crossing diamond sign",
  },
  {
    id: "added-lane",
    name: "Added Lane",
    section: "warning",
    description:
      "Traffic from another road will be entering the road you are on. No merging is necessary because a lane has been added.",
    imageUrl: "/signs/added-lane.webp",
    imageHint: "added lane diamond sign",
  },

  // ── WORK ZONE & RAILROAD ──
  {
    id: "railroad-crossing-advance",
    name: "Railroad Crossing (Advance Warning)",
    section: "work-zone",
    description:
      "The advance warning sign tells you that you are nearing a railroad crossing. Be prepared to stop. Advance warning signs are placed before a railroad crossing. These signs warn you to look, listen, slow down and be prepared to stop for trains or any vehicles using the rails.",
    imageUrl: "/signs/railroad-crossing-advance.webp",
    imageHint: "yellow circular railroad crossing advance warning",
  },
  {
    id: "railroad-crossbuck",
    name: "Railroad Crossbuck",
    section: "work-zone",
    description:
      "This sign is a warning of a railroad crossing. Look, listen, slow down and be prepared to stop for trains or any vehicles using the rails. Trains may be approaching from either direction. If there is more than one track, trains may be approaching from either direction on either track.",
    imageUrl: "/signs/railroad-crossbuck.webp",
    imageHint: "white X railroad crossbuck sign",
  },
  {
    id: "railroad-crossbuck-flashing",
    name: "Railroad Crossbuck and Flashing Lights",
    section: "work-zone",
    description:
      "Flashing lights may be used with crossbuck signs. Always stop when the light begins to flash and be alert for approaching trains. Do not proceed until all trains or any other vehicles using the rails have passed, the tracks are clear, and the lights are no longer flashing. Be especially alert at multi-track crossings because a second train could be approaching from the opposite direction.",
    imageUrl: "/signs/railroad-crossbuck-flashing.webp",
    imageHint: "railroad crossbuck with red flashing lights",
  },
  {
    id: "crossbuck-flashing-gate",
    name: "Crossbuck, Flashing Lights and Gate",
    section: "work-zone",
    description:
      "Gates are used with flashing light signals at some crossings. Stop when the lights begin to flash and before the gate lowers. Remain stopped until the gates are raised and the lights stop flashing. Do not attempt to drive around the lowered gate.",
    imageUrl: "/signs/crossbuck-flashing-gate.webp",
    imageHint: "railroad crossing with gate arm",
  },
  {
    id: "rough-road-bump",
    name: "Rough Road / Bump / Uneven Lanes",
    section: "work-zone",
    description:
      "These signs are used when certain road conditions, such as loose gravel or road construction, affect the roadway surface and create potentially difficult conditions for motorists, especially motorcyclists.",
    imageUrl: "/signs/rough-road-bump.webp",
    imageHint: "orange ROUGH ROAD, BUMP, and UNEVEN LANES diamond signs",
  },
  {
    id: "road-construction-detour",
    name: "Road Construction Ahead / Detour",
    section: "work-zone",
    description:
      "These signs indicate a change in the traffic pattern or route ahead. Slow down. Unusual or potentially dangerous conditions are ahead.",
    imageUrl: "/signs/road-construction-detour.webp",
    imageHint: "orange ROAD WORK AHEAD diamond and DETOUR rectangle signs",
  },
  {
    id: "flashing-arrow-board",
    name: "Flashing Arrow Boards",
    section: "work-zone",
    description:
      "Large flashing arrow boards or flashing message signs in work zones direct drivers to proceed into different traffic lanes and inform them that part of the road ahead is closed.",
    imageUrl: "/signs/flashing-arrow-board.webp",
    imageHint: "yellow flashing arrow board",
  },
  {
    id: "flaggers",
    name: "Flaggers",
    section: "work-zone",
    description:
      "Flaggers are highway workers who normally wear orange or yellow vests, or yellow-green shirts or jackets. They use STOP/SLOW paddles or red flags to stop or direct traffic through the work zone, and to let other workers or construction vehicles cross the road.",
    imageUrl: "/signs/flaggers.webp",
    imageHint: "highway flagger with stop paddle illustration",
  },
  {
    id: "photo-speed-enforcement",
    name: "Photo Speed Enforcement",
    section: "work-zone",
    description:
      "This sign indicates that automated photo enforcement is in place for speeding in a work zone. Always obey the posted speed limit in a work zone.",
    imageUrl: "/signs/photo-speed-enforcement.webp",
    imageHint: "WORK ZONE SPEED PHOTO ENFORCED sign",
  },
  {
    id: "traffic-control-devices",
    name: "Traffic Control Devices",
    section: "work-zone",
    description:
      "Barricades, vertical signs, concrete barriers, drums and cones are the most common devices used to guide drivers safely through work zones. When driving near the devices, keep your vehicle in the middle of the lane and obey the posted speed limit. As you leave the work zone, stay in your lane and maintain your speed. Don't change lanes until you are completely clear of the work zone.",
    imageUrl: "/signs/traffic-control-devices.webp",
    imageHint: "orange and white barricade with cone and drum",
  },
  {
    id: "rumble-strips-ahead",
    name: "Rumble Strips Ahead",
    section: "work-zone",
    description:
      "Rumble Strips Ahead signs warn motorists of black or orange strips placed across the travel lanes in advance of work zones, including a flagger or lane closure. Rumble strips should be slowly driven over, not swerved around.",
    imageUrl: "/signs/rumble-strips-ahead.webp",
    imageHint: "orange diamond RUMBLE STRIPS AHEAD sign",
  },
  {
    id: "slow-moving-vehicles",
    name: "Slow Moving Vehicles",
    section: "work-zone",
    description:
      "Vehicles traveling at 25 MPH or less, such as farm equipment, horse-drawn vehicles or highway work vehicles, must display these signs when using a public highway. Be prepared to adjust your speed or position when you see a vehicle with one of these signs.",
    imageUrl: "/signs/slow-moving-vehicles.webp",
    imageHint: "orange triangle slow moving vehicle emblem",
  },

  // ── PAVEMENT MARKINGS ──
  {
    id: "red-markings",
    name: "Red Markings",
    section: "pavement-markings",
    description:
      "Red markings are generally not used; but, some communities do use red curbs to indicate no parking zones.",
    imageUrl: "/signs/red-markings.webp",
    imageHint: "red painted curb",
  },
  {
    id: "red-reflectors",
    name: "Red Reflectors",
    section: "pavement-markings",
    description:
      "Red reflectors on the pavement show areas not to be entered or used. They are positioned on the road surface so that only traffic flowing in the wrong direction would observe them.",
    imageUrl: "/signs/red-reflectors.webp",
    imageHint: "red pavement reflectors",
  },
  {
    id: "yellow-center-lines",
    name: "Yellow Center Lines",
    section: "pavement-markings",
    description:
      "Yellow center lines mean two-way traffic, flowing in opposite directions.",
    imageUrl: "/signs/broken-yellow-center.webp",
    imageHint: "yellow center line on road",
  },
  {
    id: "broken-yellow-center",
    name: "Broken Yellow Center Lines",
    section: "pavement-markings",
    description:
      "Broken yellow center lines mean that passing on the left is allowed in either direction when the way ahead is clear.",
    imageUrl: "/signs/broken-yellow-center.webp",
    imageHint: "broken yellow center line",
  },
  {
    id: "broken-yellow-solid-yellow",
    name: "Broken Yellow Alongside Solid Yellow",
    section: "pavement-markings",
    description:
      "A broken yellow line alongside a solid yellow line means that passing is allowed from the side of the broken line, but not from the side of the solid line. Vehicles on the solid yellow line side may only cross the line to pass pedestrians, bicyclists, and riders of scooters or skateboards, when the opposite lane is clear and you can pass safely.",
    imageUrl: "/signs/broken-yellow-solid-yellow.webp",
    imageHint: "broken yellow line alongside solid yellow line",
  },
  {
    id: "double-solid-yellow",
    name: "Double Solid Yellow Lines",
    section: "pavement-markings",
    description:
      "Double solid yellow lines mark the center of the road and separate traffic traveling in two different directions. Passing is not allowed in either direction. You may not cross the lines unless you are making a left turn or passing pedestrians, bicyclists, and riders of scooters or skateboards, when the opposite lane is clear and you can pass safely.",
    imageUrl: "/signs/double-solid-yellow.webp",
    imageHint: "double solid yellow lines",
  },
  {
    id: "broken-white-lines",
    name: "Broken White Lines",
    section: "pavement-markings",
    description:
      "Broken white lines separate lanes of traffic going in the same direction. You may change lanes with caution.",
    imageUrl: "/signs/broken-white-lines.webp",
    imageHint: "broken white lane lines",
  },
  {
    id: "dotted-white-lines",
    name: "Dotted White Lines",
    section: "pavement-markings",
    description:
      "Dotted white lines are actually small rectangles in a series where each is closely spaced to the next. They are used to show lane assignment in intersections and interchanges where there might otherwise be a tendency to drift out of a lane or an area of intended use. Often they are used to guide two turning lanes through the intersection. Dotted white lines are also used to denote the opening of a turn lane at an intersection and entrance/exit lanes at interchanges.",
    imageUrl: "/signs/broken-white-lines.webp",
    imageHint: "dotted white lane line at intersection",
  },
  {
    id: "unmarked-two-lane-roads",
    name: "Unmarked Two-Lane Roads in Liberia",
    section: "pavement-markings",
    description:
      "Many two-lane roads in Liberia do not have lane markings to separate the lanes. On an unmarked two-lane road, you may pass a slow moving vehicle on the left side if there are no signs prohibiting passing. Make sure that the way is clear.",
    imageUrl: "/signs/unmarked-two-lane-roads.webp",
    imageHint: "unmarked Liberian rural road",
    liberiaSpecific: true,
  },
];

// Sign color reference: rendered as a callout block at the top of the page
export const signColorMeanings = [
  {
    colors: "Red with white",
    meaning:
      "Conveys stop, yield, do not, and no. Stop signs, yield signs, do not enter or wrong way signs, the circle and slash in a no turn sign, and the restrictions in a parking sign are examples.",
  },
  {
    colors: "Black with white",
    meaning:
      "Conveys regulatory information. Speed limit, do not pass, no turns are examples where the operation is regulated by law and the black and white sign would be found.",
  },
  {
    colors: "Yellow with black",
    meaning:
      "Conveys a warning. Curve ahead, stop ahead, overhead clearances, slippery when wet, are all examples.",
  },
  {
    colors: "Yellow-green with black",
    meaning:
      "A specialized class of warning signs uses a strong yellow/green color with black to advise of school zone, pedestrian and/or bicyclist activities.",
  },
  {
    colors: "Green with white",
    meaning: "Provides destination types of information.",
  },
  {
    colors: "Blue with white",
    meaning: "Informs regarding motorists services.",
  },
  {
    colors: "Brown with white",
    meaning:
      "Advises of historical or cultural interests that might exist in the area.",
  },
  {
    colors: "Orange with black",
    meaning:
      "Used to advise and warn in construction (orange) areas. Used with black and white signs that convey regulations that might exist only because of the construction effort.",
  },
  {
    colors: "Pink with black",
    meaning:
      "Used to advise and warn in incident (pink) areas. Used with black and white signs that convey regulations that might exist only because of the incident.",
  },
];
