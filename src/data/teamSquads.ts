// Previous season squad for each team — used for retention eligibility
// Only players who were part of a team's squad in the previous season can be retained
// Format: { [auctionYear]: { [teamId]: PlayerInfo[] } }

interface SquadPlayer {
  name: string;
  role: "Batter" | "Bowler" | "All-Rounder" | "WK";
  country: string;
  overseas: boolean;
}

// Helper to create player entries
const B = (name: string, country = "India", overseas = false): SquadPlayer => ({ name, role: "Batter", country, overseas });
const BW = (name: string, country = "India", overseas = false): SquadPlayer => ({ name, role: "Bowler", country, overseas });
const AR = (name: string, country = "India", overseas = false): SquadPlayer => ({ name, role: "All-Rounder", country, overseas });
const WK = (name: string, country = "India", overseas = false): SquadPlayer => ({ name, role: "WK", country, overseas });

// ===================== IPL 2011 (retain from 2010 squads) =====================
const SQUADS_2010: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("Ashish Nehra"),
    B("Murali Vijay"), AR("Albie Morkel", "South Africa", true), BW("Doug Bollinger", "Australia", true),
    B("Badrinath"), AR("Dwayne Bravo", "West Indies", true), B("Matthew Hayden", "Australia", true),
    BW("Shadab Jakati"), BW("Balaji"), AR("Joginder Sharma"), B("Anirudha Srikkanth"),
    BW("R Ashwin"), BW("Suraj Randiv", "Sri Lanka", true), B("Ankit Rajpoot"),
    WK("Parthiv Patel"), B("S Badrinath"), BW("Manpreet Gony"), AR("Jacob Oram", "New Zealand", true),
    B("Subramaniam Badrinath"), BW("Yo Mahesh"),
  ],
  mi: [
    B("Sachin Tendulkar"), B("Shikhar Dhawan"), AR("Kieron Pollard", "West Indies", true),
    BW("Lasith Malinga", "Sri Lanka", true), BW("Harbhajan Singh"), AR("JP Duminy", "South Africa", true),
    B("Ambati Rayudu"), WK("Adam Gilchrist", "Australia", true), B("Saurabh Tiwary"),
    AR("Abhishek Nayar"), BW("Zaheer Khan"), BW("Dhawal Kulkarni"), B("Aiden Blizzard", "Australia", true),
    BW("Abu Nechim"), WK("Dinesh Karthik"), B("Rohit Sharma"), BW("Pragyan Ojha"),
    BW("Munaf Patel"), AR("Duminy"), B("Ankeet Chavan"),
  ],
  rcb: [
    B("Virat Kohli"), B("Jacques Kallis", "South Africa", true), AR("Kevin Pietersen", "England", true),
    BW("Anil Kumble"), WK("Mark Boucher", "South Africa", true), B("Manish Pandey"),
    AR("Robin Uthappa"), BW("Praveen Kumar"), BW("Vinay Kumar"), B("Rahul Dravid"),
    BW("Dirk Nannes", "Australia", true), AR("Ross Taylor", "New Zealand", true),
    B("Tillakaratne Dilshan", "Sri Lanka", true), BW("Muttiah Muralitharan", "Sri Lanka", true),
    BW("Zaheer Khan"), B("Devdutt Padikkal"), WK("AB de Villiers", "South Africa", true),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Jacques Kallis", "South Africa", true), B("Sourav Ganguly"),
    AR("Yusuf Pathan"), BW("Brett Lee", "Australia", true), WK("Brad Haddin", "Australia", true),
    B("Manoj Tiwary"), BW("Ajantha Mendis", "Sri Lanka", true), AR("Laxmi Ratan Shukla"),
    B("Chris Gayle", "West Indies", true), BW("Shane Bond", "New Zealand", true),
    AR("Rajat Bhatia"), BW("Ishant Sharma"), B("Debabrata Das"), WK("Wriddhiman Saha"),
    BW("Iqbal Abdulla"), BW("Balaji"), AR("Angelo Mathews", "Sri Lanka", true),
  ],
  dd: [
    B("Virender Sehwag"), B("David Warner", "Australia", true), AR("Paul Collingwood", "England", true),
    WK("Dinesh Karthik"), B("AB de Villiers", "South Africa", true), AR("Tillakaratne Dilshan", "Sri Lanka", true),
    BW("Daniel Vettori", "New Zealand", true), BW("Amit Mishra"), AR("Irfan Pathan"),
    BW("Ashish Nehra"), B("Venugopal Rao"), BW("Pradeep Sangwan"), AR("Mithun Manhas"),
    WK("Naman Ojha"), B("Yogesh Nagar"), BW("Ajit Agarkar"), BW("Umesh Yadav"),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Rahul Dravid"), AR("Yusuf Pathan"),
    B("Naman Ojha"), WK("Shreevats Goswami"), BW("Shane Warne", "Australia", true),
    BW("Munaf Patel"), AR("Ravindra Jadeja"), B("Swapnil Asnodkar"),
    BW("Siddharth Trivedi"), AR("Dimitri Mascarenhas", "England", true),
    B("Aakash Chopra"), BW("Kamran Khan"), B("Faiz Fazal"), AR("Johan Botha", "South Africa", true),
    BW("Amit Singh"), WK("Dishant Yagnik"),
  ],
  kxip: [
    B("Adam Gilchrist", "Australia", true), B("Paul Valthaty"), AR("Yuvraj Singh"),
    B("Shaun Marsh", "Australia", true), WK("Kumar Sangakkara", "Sri Lanka", true),
    BW("Brett Lee", "Australia", true), AR("Irfan Pathan"), BW("Piyush Chawla"),
    B("Dinesh Karthik"), AR("David Hussey", "Australia", true), BW("Shalabh Srivastava"),
    B("Karan Goel"), BW("Sreesanth"), AR("James Faulkner", "Australia", true),
    B("Mandeep Singh"), WK("Nitin Saini"),
  ],
  dch: [
    B("Adam Gilchrist", "Australia", true), B("Herschelle Gibbs", "South Africa", true),
    AR("Andrew Symonds", "Australia", true), WK("Parthiv Patel"), BW("Pragyan Ojha"),
    AR("Rohit Sharma"), BW("RP Singh"), BW("Dale Steyn", "South Africa", true),
    B("VVS Laxman"), AR("Daniel Harris", "Australia", true), B("Tirumalasetti Suman"),
    BW("Chaminda Vaas", "Sri Lanka", true), AR("Venugopal Rao"), BW("Harmeet Singh"),
    BW("Amit Mishra"), B("Scott Styris", "New Zealand", true),
  ],
};

// ===================== IPL 2012 (retain from 2011 squads) =====================
const SQUADS_2011: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("R Ashwin"),
    AR("Dwayne Bravo", "West Indies", true), AR("Albie Morkel", "South Africa", true),
    B("Murali Vijay"), BW("Doug Bollinger", "Australia", true), B("S Badrinath"),
    BW("Shadab Jakati"), BW("Ben Hilfenhaus", "Australia", true), WK("Wriddhiman Saha"),
    B("Subramaniam Badrinath"), BW("Ashish Nehra"), B("Faf du Plessis", "South Africa", true),
    AR("DJ Bravo", "West Indies", true), BW("Mohit Sharma"), B("Michael Hussey", "Australia", true),
  ],
  mi: [
    B("Sachin Tendulkar"), B("Rohit Sharma"), AR("Kieron Pollard", "West Indies", true),
    BW("Lasith Malinga", "Sri Lanka", true), BW("Harbhajan Singh"), B("Ambati Rayudu"),
    AR("JP Duminy", "South Africa", true), B("Saurabh Tiwary"), BW("Munaf Patel"),
    BW("Dhawal Kulkarni"), AR("Abhishek Nayar"), WK("Aditya Tare"),
    BW("Pragyan Ojha"), AR("James Franklin", "New Zealand", true), B("Herschelle Gibbs", "South Africa", true),
    B("Davy Jacobs"), BW("Abu Nechim"), AR("Andrew Symonds", "Australia", true),
  ],
  rcb: [
    B("Virat Kohli"), B("Chris Gayle", "West Indies", true), WK("AB de Villiers", "South Africa", true),
    AR("Daniel Vettori", "New Zealand", true), BW("Zaheer Khan"), B("Tillakaratne Dilshan", "Sri Lanka", true),
    B("Luke Pomersbach", "Australia", true), AR("Syed Mohammad"), BW("Dirk Nannes", "Australia", true),
    B("Mayank Agarwal"), BW("Vinay Kumar"), BW("Muttiah Muralitharan", "Sri Lanka", true),
    AR("Arun Karthik"), WK("Cheteshwar Pujara"), B("Sachin Baby"), BW("KP Appanna"),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Jacques Kallis", "South Africa", true), BW("Brett Lee", "Australia", true),
    AR("Yusuf Pathan"), B("Manoj Tiwary"), AR("Rajat Bhatia"),
    BW("Iqbal Abdulla"), AR("Shakib Al Hasan", "Bangladesh", true), B("Debabrata Das"),
    WK("Brendon McCullum", "New Zealand", true), BW("Balaji"), BW("Laxmipathy Balaji"),
    AR("Laxmi Ratan Shukla"), B("Bisla"), BW("Marchant de Lange", "South Africa", true),
    WK("Manvinder Bisla"), B("Eoin Morgan", "England", true), AR("Sunil Narine", "West Indies", true),
  ],
  dd: [
    B("Virender Sehwag"), B("David Warner", "Australia", true), WK("Naman Ojha"),
    BW("Umesh Yadav"), AR("Irfan Pathan"), BW("Morne Morkel", "South Africa", true),
    BW("Amit Mishra"), B("Mahela Jayawardene", "Sri Lanka", true), AR("Kevin Pietersen", "England", true),
    B("Unmukt Chand"), BW("Varun Aaron"), AR("Ajit Agarkar"), B("Venugopal Rao"),
    BW("Nadeem"), AR("Ben Rohrer", "Australia", true), B("Ross Taylor", "New Zealand", true),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Rahul Dravid"), AR("Johan Botha", "South Africa", true),
    WK("Brad Hodge", "Australia", true), BW("Siddharth Trivedi"), B("Owais Shah", "England", true),
    BW("Amit Singh"), AR("Ravindra Jadeja"), WK("Dishant Yagnik"),
    B("Ajinkya Rahane"), BW("Shaun Tait", "Australia", true), AR("Stuart Binny"),
    B("Ashok Menaria"), BW("Sreesanth"), B("Swapnil Asnodkar"),
    AR("James Faulkner", "Australia", true), B("Aakash Chopra"),
  ],
  kxip: [
    AR("Yuvraj Singh"), B("Adam Gilchrist", "Australia", true), B("Shaun Marsh", "Australia", true),
    BW("Piyush Chawla"), B("Paul Valthaty"), AR("David Hussey", "Australia", true),
    BW("Praveen Kumar"), B("Mandeep Singh"), AR("Ryan Harris", "Australia", true),
    BW("Bhargav Bhatt"), WK("Nitin Saini"), B("Dinesh Karthik"),
    BW("Dimitri Mascarenhas", "England", true), AR("Bipul Sharma"), B("Sunny Singh"),
    BW("Shalabh Srivastava"), AR("Abhishek Sharma"),
  ],
  dch: [
    B("Shikhar Dhawan"), WK("Parthiv Patel"), BW("Dale Steyn", "South Africa", true),
    B("Cameron White", "Australia", true), AR("Daniel Christian", "Australia", true),
    BW("Ishant Sharma"), B("JP Duminy", "South Africa", true), AR("Dan Harris", "Australia", true),
    B("VVS Laxman"), BW("Pragyan Ojha"), AR("Darren Sammy", "West Indies", true),
    BW("Amit Mishra"), B("Kumar Sangakkara", "Sri Lanka", true), AR("Venugopal Rao"),
    BW("Ankit Sharma"), WK("Sunny Sohal"),
  ],
  pwi: [
    B("Robin Uthappa"), B("Sourav Ganguly"), AR("Yuvraj Singh"),
    AR("Jesse Ryder", "New Zealand", true), BW("Ashish Nehra"), B("Callum Ferguson", "Australia", true),
    WK("Robin Uthappa"), AR("Marlon Samuels", "West Indies", true), BW("Rahul Sharma"),
    B("Manish Pandey"), BW("Alfonso Thomas", "South Africa", true), AR("Steven Smith", "Australia", true),
    B("Mithun Manhas"), BW("Murali Kartik"), WK("Tirumalasetti Suman"),
  ],
};

// ===================== IPL 2013 (retain from 2012 squads) =====================
const SQUADS_2012: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("R Ashwin"),
    AR("Dwayne Bravo", "West Indies", true), B("Faf du Plessis", "South Africa", true),
    B("Murali Vijay"), B("Michael Hussey", "Australia", true), BW("Ben Hilfenhaus", "Australia", true),
    B("S Badrinath"), BW("Mohit Sharma"), WK("Wriddhiman Saha"),
    AR("Albie Morkel", "South Africa", true), BW("Shadab Jakati"), B("Subramaniam Badrinath"),
    BW("Jason Holder", "West Indies", true), AR("Chris Morris", "South Africa", true),
    B("Brendon McCullum", "New Zealand", true),
  ],
  mi: [
    B("Sachin Tendulkar"), B("Rohit Sharma"), AR("Kieron Pollard", "West Indies", true),
    BW("Lasith Malinga", "Sri Lanka", true), BW("Harbhajan Singh"), B("Ambati Rayudu"),
    WK("Dinesh Karthik"), AR("Dwayne Smith", "West Indies", true), B("Aditya Tare"),
    BW("Pragyan Ojha"), BW("Dhawal Kulkarni"), BW("Mitchell Johnson", "Australia", true),
    AR("Glenn Maxwell", "Australia", true), B("Ricky Ponting", "Australia", true),
    AR("James Franklin", "New Zealand", true), BW("Munaf Patel"), B("Herschelle Gibbs", "South Africa", true),
  ],
  rcb: [
    B("Virat Kohli"), B("Chris Gayle", "West Indies", true), WK("AB de Villiers", "South Africa", true),
    AR("Daniel Vettori", "New Zealand", true), BW("Zaheer Khan"), BW("Vinay Kumar"),
    AR("Muttiah Muralitharan", "Sri Lanka", true), B("Tillakaratne Dilshan", "Sri Lanka", true),
    B("Mayank Agarwal"), BW("KP Appanna"), B("Cheteshwar Pujara"),
    AR("Moises Henriques", "Australia", true), B("Syed Mohammad"), WK("Arun Karthik"),
    BW("Harshal Patel"), B("Sachin Baby"),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Jacques Kallis", "South Africa", true), AR("Sunil Narine", "West Indies", true),
    B("Manvinder Bisla"), AR("Yusuf Pathan"), B("Manoj Tiwary"),
    AR("Shakib Al Hasan", "Bangladesh", true), BW("Brett Lee", "Australia", true),
    AR("Rajat Bhatia"), WK("Brendon McCullum", "New Zealand", true), BW("Laxmipathy Balaji"),
    B("Eoin Morgan", "England", true), BW("Iqbal Abdulla"),
    AR("Laxmi Ratan Shukla"), B("Debabrata Das"), BW("Marchant de Lange", "South Africa", true),
  ],
  dd: [
    B("Virender Sehwag"), B("David Warner", "Australia", true), BW("Umesh Yadav"),
    AR("Irfan Pathan"), BW("Morne Morkel", "South Africa", true), BW("Amit Mishra"),
    B("Mahela Jayawardene", "Sri Lanka", true), WK("Naman Ojha"), B("Unmukt Chand"),
    AR("Kevin Pietersen", "England", true), BW("Varun Aaron"), AR("Ben Rohrer", "Australia", true),
    B("Ross Taylor", "New Zealand", true), BW("Shahbaz Nadeem"), B("Pawan Negi"),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Rahul Dravid"), B("Ajinkya Rahane"),
    AR("Stuart Binny"), AR("Johan Botha", "South Africa", true), WK("Brad Hodge", "Australia", true),
    BW("Siddharth Trivedi"), WK("Dishant Yagnik"), AR("James Faulkner", "Australia", true),
    BW("Shaun Tait", "Australia", true), B("Owais Shah", "England", true),
    B("Ashok Menaria"), BW("Amit Singh"), BW("Sreesanth"), B("Kevon Cooper", "West Indies", true),
  ],
  kxip: [
    AR("David Miller", "South Africa", true), B("Adam Gilchrist", "Australia", true),
    BW("Piyush Chawla"), B("Mandeep Singh"), AR("David Hussey", "Australia", true),
    B("Shaun Marsh", "Australia", true), BW("Praveen Kumar"), B("Paul Valthaty"),
    AR("Azhar Mahmood", "Pakistan", true), WK("Nitin Saini"), BW("Harmeet Singh"),
    AR("Bipul Sharma"), B("Manan Vohra"), BW("Dimitri Mascarenhas", "England", true),
    B("Gurkeerat Singh"), BW("Parwinder Awana"),
  ],
  dch: [
    B("Shikhar Dhawan"), BW("Dale Steyn", "South Africa", true), WK("Parthiv Patel"),
    B("Cameron White", "Australia", true), AR("Daniel Christian", "Australia", true),
    BW("Ishant Sharma"), B("Kumar Sangakkara", "Sri Lanka", true), AR("Darren Sammy", "West Indies", true),
    BW("Amit Mishra"), B("VVS Laxman"), BW("Pragyan Ojha"), AR("Thisara Perera", "Sri Lanka", true),
    B("JP Duminy", "South Africa", true), AR("Venugopal Rao"), WK("Sunny Sohal"),
  ],
  pwi: [
    B("Robin Uthappa"), B("Sourav Ganguly"), AR("Steven Smith", "Australia", true),
    BW("Ashish Nehra"), AR("Marlon Samuels", "West Indies", true), BW("Rahul Sharma"),
    B("Manish Pandey"), AR("Angelo Mathews", "Sri Lanka", true), AR("Mitchell Marsh", "Australia", true),
    BW("Alfonso Thomas", "South Africa", true), B("Callum Ferguson", "Australia", true),
    WK("Tirumalasetti Suman"), AR("Jesse Ryder", "New Zealand", true), BW("Murali Kartik"),
  ],
};

// ===================== IPL 2014 (retain from 2013 squads) =====================
const SQUADS_2013: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("R Ashwin"),
    AR("Dwayne Bravo", "West Indies", true), B("Michael Hussey", "Australia", true),
    B("Faf du Plessis", "South Africa", true), B("Murali Vijay"), BW("Mohit Sharma"),
    AR("Chris Morris", "South Africa", true), WK("Wriddhiman Saha"),
    BW("Dirk Nannes", "Australia", true), B("S Badrinath"), BW("Shadab Jakati"),
    B("Brendon McCullum", "New Zealand", true), AR("Albie Morkel", "South Africa", true),
    BW("Jason Holder", "West Indies", true), B("Subramaniam Badrinath"),
  ],
  mi: [
    B("Rohit Sharma"), B("Sachin Tendulkar"), AR("Kieron Pollard", "West Indies", true),
    BW("Lasith Malinga", "Sri Lanka", true), BW("Harbhajan Singh"), B("Ambati Rayudu"),
    WK("Dinesh Karthik"), BW("Mitchell Johnson", "Australia", true), AR("Dwayne Smith", "West Indies", true),
    WK("Aditya Tare"), BW("Pragyan Ojha"), AR("Glenn Maxwell", "Australia", true),
    B("Ricky Ponting", "Australia", true), BW("Dhawal Kulkarni"), BW("Munaf Patel"),
    AR("Corey Anderson", "New Zealand", true),
  ],
  rcb: [
    B("Virat Kohli"), B("Chris Gayle", "West Indies", true), WK("AB de Villiers", "South Africa", true),
    AR("Daniel Vettori", "New Zealand", true), BW("Vinay Kumar"), B("Tillakaratne Dilshan", "Sri Lanka", true),
    AR("Moises Henriques", "Australia", true), BW("Ravi Rampaul", "West Indies", true),
    B("Cheteshwar Pujara"), B("Mayank Agarwal"), BW("Harshal Patel"),
    BW("KP Appanna"), AR("Muttiah Muralitharan", "Sri Lanka", true), B("Syed Mohammad"),
    WK("Arun Karthik"), B("Sachin Baby"),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Sunil Narine", "West Indies", true), AR("Jacques Kallis", "South Africa", true),
    AR("Yusuf Pathan"), B("Manvinder Bisla"), B("Manoj Tiwary"),
    AR("Shakib Al Hasan", "Bangladesh", true), AR("Rajat Bhatia"), BW("Brett Lee", "Australia", true),
    BW("Laxmipathy Balaji"), WK("Brendon McCullum", "New Zealand", true),
    B("Eoin Morgan", "England", true), BW("Iqbal Abdulla"), AR("Laxmi Ratan Shukla"),
    B("Debabrata Das"), BW("Umesh Yadav"),
  ],
  dd: [
    B("Virender Sehwag"), B("David Warner", "Australia", true), AR("Kevin Pietersen", "England", true),
    BW("Umesh Yadav"), AR("Irfan Pathan"), BW("Morne Morkel", "South Africa", true),
    BW("Amit Mishra"), B("Mahela Jayawardene", "Sri Lanka", true), WK("Naman Ojha"),
    B("Unmukt Chand"), BW("Shahbaz Nadeem"), B("Manprit Juneja"),
    AR("Ben Rohrer", "Australia", true), BW("Varun Aaron"), B("Pawan Negi"),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Ajinkya Rahane"), AR("Stuart Binny"),
    AR("James Faulkner", "Australia", true), WK("Dishant Yagnik"), BW("Siddharth Trivedi"),
    B("Brad Hodge", "Australia", true), AR("Johan Botha", "South Africa", true),
    BW("Shaun Tait", "Australia", true), B("Rahul Dravid"),
    B("Kevon Cooper", "West Indies", true), B("Ashok Menaria"), BW("Amit Singh"),
    B("Sachin Baby"), WK("Sanju Samson"),
  ],
  kxip: [
    AR("David Miller", "South Africa", true), BW("Piyush Chawla"), B("Mandeep Singh"),
    AR("David Hussey", "Australia", true), B("Adam Gilchrist", "Australia", true),
    B("Shaun Marsh", "Australia", true), BW("Praveen Kumar"), B("Manan Vohra"),
    AR("Azhar Mahmood", "Pakistan", true), WK("Nitin Saini"), AR("Bipul Sharma"),
    B("Gurkeerat Singh"), BW("Parwinder Awana"), BW("Harmeet Singh"),
    B("Luke Pomersbach", "Australia", true),
  ],
  srh: [
    B("Shikhar Dhawan"), B("David Warner", "Australia", true), BW("Dale Steyn", "South Africa", true),
    WK("Parthiv Patel"), BW("Ishant Sharma"), AR("Darren Sammy", "West Indies", true),
    AR("Thisara Perera", "Sri Lanka", true), BW("Amit Mishra"), BW("Bhuvneshwar Kumar"),
    AR("Hanuma Vihari"), B("Cameron White", "Australia", true), AR("Irfan Pathan"),
    B("Akshath Reddy"), WK("Quinton de Kock", "South Africa", true), BW("Karn Sharma"),
    AR("Daniel Christian", "Australia", true),
  ],
};

// ===================== IPL 2018 (mega auction — retain from 2017 squads) =====================
const SQUADS_2017: Record<string, SquadPlayer[]> = {
  mi: [
    B("Rohit Sharma"), AR("Hardik Pandya"), BW("Jasprit Bumrah"),
    AR("Kieron Pollard", "West Indies", true), BW("Lasith Malinga", "Sri Lanka", true),
    B("Ambati Rayudu"), WK("Parthiv Patel"), AR("Krunal Pandya"), BW("Mitchell McClenaghan", "New Zealand", true),
    AR("Corey Anderson", "New Zealand", true), B("Nitish Rana"), B("Jos Buttler", "England", true),
    AR("Karn Sharma"), BW("Vinay Kumar"), B("Lendl Simmons", "West Indies", true),
    WK("Sanju Samson"), BW("Harbhajan Singh"), BW("Mitchell Johnson", "Australia", true),
    AR("Tim Southee", "New Zealand", true), B("Shreyas Gopal"), B("Unmukt Chand"),
    AR("Deepak Punia"),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), B("Chris Gayle", "West Indies", true),
    AR("Shane Watson", "Australia", true), AR("Stuart Binny"), BW("Yuzvendra Chahal"),
    B("KL Rahul"), BW("Samuel Badree", "West Indies", true), B("Mandeep Singh"),
    AR("Travis Head", "Australia", true), BW("Avesh Khan"), BW("Pawan Negi"),
    AR("Iqbal Abdulla"), WK("Kedar Jadhav"), B("Sachin Baby"),
    BW("Aniket Choudhary"), BW("Sreenath Aravind"), AR("Billy Stanlake", "Australia", true),
  ],
  kkr: [
    AR("Sunil Narine", "West Indies", true), AR("Andre Russell", "West Indies", true),
    B("Gautam Gambhir"), AR("Chris Woakes", "England", true), B("Manish Pandey"),
    AR("Yusuf Pathan"), BW("Umesh Yadav"), BW("Piyush Chawla"),
    B("Robin Uthappa"), WK("Sheldon Jackson"), AR("Shakib Al Hasan", "Bangladesh", true),
    AR("Colin de Grandhomme", "New Zealand", true), B("Ishank Jaggi"),
    BW("Kuldeep Yadav"), AR("Ankit Rajpoot"), WK("Surya Kumar Yadav"),
    B("Darren Bravo", "West Indies", true), BW("Nathan Coulter-Nile", "Australia", true),
  ],
  dd: [
    B("Shreyas Iyer"), AR("Chris Morris", "South Africa", true), WK("Rishabh Pant"),
    B("Karun Nair"), BW("Amit Mishra"), BW("Zaheer Khan"),
    AR("Carlos Brathwaite", "West Indies", true), B("Sanju Samson"),
    B("Sam Billings", "England", true), AR("Corey Anderson", "New Zealand", true),
    BW("Pat Cummins", "Australia", true), AR("Shahbaz Nadeem"),
    BW("Jayant Yadav"), AR("Angelo Mathews", "Sri Lanka", true), B("Quinton de Kock", "South Africa", true),
    AR("Marlon Samuels", "West Indies", true), BW("Mohammed Shami"),
  ],
  kxip: [
    AR("Glenn Maxwell", "Australia", true), B("Hashim Amla", "South Africa", true),
    AR("David Miller", "South Africa", true), B("Manan Vohra"), AR("Axar Patel"),
    BW("Sandeep Sharma"), WK("Wriddhiman Saha"), BW("Varun Aaron"),
    B("Shaun Marsh", "Australia", true), AR("Marcus Stoinis", "Australia", true),
    BW("Mohit Sharma"), AR("Murali Vijay"), BW("Matt Henry", "New Zealand", true),
    B("Gurkeerat Singh"), AR("Swapnil Singh"), WK("Nikhil Naik"),
    BW("KC Cariappa"), BW("T Natarajan"),
  ],
  srh: [
    B("David Warner", "Australia", true), BW("Bhuvneshwar Kumar"), B("Shikhar Dhawan"),
    AR("Ben Cutting", "Australia", true), AR("Moises Henriques", "Australia", true),
    WK("Naman Ojha"), BW("Rashid Khan", "Afghanistan", true), AR("Yuvraj Singh"),
    B("Kane Williamson", "New Zealand", true), BW("Siddarth Kaul"), BW("Mohammed Siraj"),
    BW("Mustafizur Rahman", "Bangladesh", true), AR("Deepak Hooda"), B("Bipul Sharma"),
    BW("Chris Jordan", "England", true), WK("Shreevats Goswami"),
    AR("Ben Laughlin", "Australia", true), B("Vijay Shankar"),
  ],
  rps: [
    WK("MS Dhoni"), B("Ajinkya Rahane"), AR("Steven Smith", "Australia", true),
    AR("Ben Stokes", "England", true), BW("Imran Tahir", "South Africa", true),
    B("Manoj Tiwary"), BW("Ashok Dinda"), AR("Dan Christian", "Australia", true),
    B("Rahul Tripathi"), BW("Washington Sundar"), BW("Jaydev Unadkat"),
    AR("Shardul Thakur"), B("Usman Khawaja", "Australia", true), AR("Baba Aparajith"),
    WK("Ankush Bains"), BW("Adam Zampa", "Australia", true), BW("Deepak Chahar"),
  ],
  gl: [
    B("Suresh Raina"), AR("Ravindra Jadeja"), AR("Dwayne Bravo", "West Indies", true),
    B("Aaron Finch", "Australia", true), AR("James Faulkner", "Australia", true),
    BW("Basil Thampi"), AR("Dwayne Smith", "West Indies", true), WK("Dinesh Karthik"),
    B("Brendon McCullum", "New Zealand", true), BW("Praveen Kumar"),
    AR("Ishan Kishan"), BW("Shivil Kaushik"), B("Eklavya Dwivedi"),
    AR("Andrew Tye", "Australia", true), WK("Parthiv Patel"),
  ],
};

// ===================== IPL 2022 (mega auction — retain from 2021 squads) =====================
const SQUADS_2021: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Ruturaj Gaikwad"), AR("Ravindra Jadeja"), BW("Deepak Chahar"),
    AR("Moeen Ali", "England", true), B("Faf du Plessis", "South Africa", true),
    B("Ambati Rayudu"), BW("Shardul Thakur"), AR("Dwayne Bravo", "West Indies", true),
    B("Robin Uthappa"), WK("N Jagadeesan"), BW("KM Asif"), AR("Sam Curran", "England", true),
    BW("Lungi Ngidi", "South Africa", true), B("Cheteshwar Pujara"), AR("Mitchell Santner", "New Zealand", true),
    BW("Josh Hazlewood", "Australia", true), B("Hari Nishanth"), BW("Tushar Deshpande"),
    AR("Krishnappa Gowtham"), B("Suresh Raina"),
  ],
  mi: [
    B("Rohit Sharma"), BW("Jasprit Bumrah"), B("Suryakumar Yadav"), AR("Hardik Pandya"),
    AR("Kieron Pollard", "West Indies", true), AR("Krunal Pandya"), WK("Quinton de Kock", "South Africa", true),
    WK("Ishan Kishan"), BW("Rahul Chahar"), BW("Trent Boult", "New Zealand", true),
    BW("Adam Milne", "New Zealand", true), B("Anmolpreet Singh"), AR("Jayant Yadav"),
    AR("James Neesham", "New Zealand", true), BW("Nathan Coulter-Nile", "Australia", true),
    B("Saurabh Tiwary"), BW("Dhawal Kulkarni"), B("Aditya Tare"),
    BW("Piyush Chawla"), AR("Marco Jansen", "South Africa", true),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), AR("Glenn Maxwell", "Australia", true),
    BW("Yuzvendra Chahal"), BW("Harshal Patel"), AR("Washington Sundar"),
    B("Devdutt Padikkal"), WK("KS Bharat"), BW("Mohammed Siraj"),
    AR("Daniel Christian", "Australia", true), AR("Kyle Jamieson", "New Zealand", true),
    BW("George Garton", "England", true), B("Sachin Baby"), AR("Shahbaz Ahmed"),
    B("Rajat Patidar"), BW("Suyash Prabhudessai"), AR("Dan Christian", "Australia", true),
    WK("Finn Allen", "New Zealand", true), BW("Tim David", "Singapore", true),
  ],
  kkr: [
    B("Shubman Gill"), AR("Andre Russell", "West Indies", true), AR("Sunil Narine", "West Indies", true),
    BW("Varun Chakaravarthy"), AR("Venkatesh Iyer"), B("Nitish Rana"),
    B("Rahul Tripathi"), AR("Shakib Al Hasan", "Bangladesh", true), WK("Dinesh Karthik"),
    BW("Lockie Ferguson", "New Zealand", true), AR("Pat Cummins", "Australia", true),
    B("Eoin Morgan", "England", true), BW("Prasidh Krishna"),
    AR("Tim Southee", "New Zealand", true), B("Karun Nair"), WK("Sheldon Jackson"),
    BW("Sandeep Warrier"), B("Harbhajan Singh"), AR("Ben Cutting", "Australia", true),
  ],
  dc: [
    WK("Rishabh Pant"), B("Shikhar Dhawan"), AR("Axar Patel"), BW("Anrich Nortje", "South Africa", true),
    B("Prithvi Shaw"), BW("Kagiso Rabada", "South Africa", true), AR("Marcus Stoinis", "Australia", true),
    AR("R Ashwin"), B("Shimron Hetmyer", "West Indies", true), BW("Avesh Khan"),
    AR("Lalit Yadav"), WK("Sam Billings", "England", true), BW("Amit Mishra"),
    B("Steve Smith", "Australia", true), AR("Tom Curran", "England", true),
    BW("Ishant Sharma"), B("Ajinkya Rahane"), BW("Umesh Yadav"),
    AR("Ripal Patel"), B("Vishnu Vinod"),
  ],
  srh: [
    B("Kane Williamson", "New Zealand", true), B("David Warner", "Australia", true),
    BW("Rashid Khan", "Afghanistan", true), BW("Bhuvneshwar Kumar"),
    B("Manish Pandey"), AR("Jason Holder", "West Indies", true), WK("Wriddhiman Saha"),
    AR("Abdul Samad"), BW("T Natarajan"), BW("Siddarth Kaul"),
    AR("Vijay Shankar"), BW("Sandeep Sharma"), AR("Jason Roy", "England", true),
    BW("Umran Malik"), B("Priyam Garg"), AR("Abhishek Sharma"),
    WK("Shreevats Goswami"), B("Kedar Jadhav"),
  ],
  rr: [
    WK("Sanju Samson"), B("Jos Buttler", "England", true), AR("Ben Stokes", "England", true),
    B("Yashasvi Jaiswal"), AR("Chris Morris", "South Africa", true), BW("Mustafizur Rahman", "Bangladesh", true),
    AR("Riyan Parag"), BW("Jaydev Unadkat"), B("Manan Vohra"),
    AR("Rahul Tewatia"), B("David Miller", "South Africa", true), AR("Shivam Dube"),
    WK("Anuj Rawat"), BW("Chetan Sakariya"), AR("Liam Livingstone", "England", true),
    BW("Kartik Tyagi"), B("Mahipal Lomror"),
  ],
  pbks: [
    B("KL Rahul"), AR("Chris Gayle", "West Indies", true), B("Mayank Agarwal"),
    AR("Moises Henriques", "Australia", true), BW("Mohammed Shami"),
    AR("Deepak Hooda"), BW("Ravi Bishnoi"), AR("Shahrukh Khan"),
    WK("Nicholas Pooran", "West Indies", true), B("Aiden Markram", "South Africa", true),
    BW("Arshdeep Singh"), B("Mandeep Singh"), AR("Chris Jordan", "England", true),
    WK("Prabhsimran Singh"), BW("Harpreet Brar"), AR("Fabian Allen", "West Indies", true),
    AR("Jhye Richardson", "Australia", true), BW("Ishan Porel"),
  ],
};

// ===================== IPL 2025 (mega auction — retain from 2024 squads) =====================
const SQUADS_2024: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Ruturaj Gaikwad"), AR("Ravindra Jadeja"), AR("Shivam Dube"),
    BW("Matheesha Pathirana", "Sri Lanka", true), BW("Tushar Deshpande"),
    AR("Moeen Ali", "England", true), B("Ajinkya Rahane"), AR("Mitchell Santner", "New Zealand", true),
    AR("Rachin Ravindra", "New Zealand", true), B("Daryl Mitchell", "New Zealand", true),
    WK("Devon Conway", "New Zealand", true), BW("Deepak Chahar"), BW("Maheesh Theekshana", "Sri Lanka", true),
    B("Shaik Rasheed"), AR("Sameer Rizvi"), B("Avanish Rao Aravelly"),
    BW("Mukesh Choudhary"), AR("Nishant Sindhu"), B("Ajeet Singh"),
    BW("Simarjeet Singh"), BW("Prashant Solanki"), AR("Rajvardhan Hangargekar"),
  ],
  mi: [
    B("Rohit Sharma"), BW("Jasprit Bumrah"), B("Suryakumar Yadav"), WK("Ishan Kishan"),
    AR("Hardik Pandya"), B("Tilak Varma"), AR("Tim David", "Singapore", true),
    BW("Piyush Chawla"), AR("Gerald Coetzee", "South Africa", true),
    BW("Akash Madhwal"), AR("Naman Dhir"), WK("Vishnu Vinod"),
    AR("Shams Mulani"), B("Nehal Wadhera"), BW("Dilshan Madushanka", "Sri Lanka", true),
    BW("Nuwan Thushara", "Sri Lanka", true), AR("Romario Shepherd", "West Indies", true),
    AR("Jason Behrendorff", "Australia", true), B("Dewald Brevis", "South Africa", true),
    WK("Arjun Tendulkar"), BW("Kumar Kartikeya"), BW("Luke Wood", "England", true),
  ],
  rcb: [
    B("Virat Kohli"), B("Faf du Plessis", "South Africa", true), BW("Mohammed Siraj"),
    AR("Glenn Maxwell", "Australia", true), B("Rajat Patidar"), WK("Dinesh Karthik"),
    AR("Cameron Green", "Australia", true), BW("Yash Dayal"), AR("Shahbaz Ahmed"),
    BW("Karn Sharma"), AR("Mahipal Lomror"), B("Anuj Rawat"),
    BW("Reece Topley", "England", true), BW("Alzarri Joseph", "West Indies", true),
    AR("Swapnil Singh"), BW("Himanshu Sharma"), B("Suyash Prabhudessai"),
    AR("Rajan Kumar"), AR("Lochan Tillaron"), BW("Mayank Dagar"),
    WK("Tom Kohler-Cadmore", "England", true),
  ],
  kkr: [
    AR("Andre Russell", "West Indies", true), AR("Sunil Narine", "West Indies", true),
    B("Shreyas Iyer"), BW("Varun Chakaravarthy"), AR("Venkatesh Iyer"),
    B("Nitish Rana"), B("Rinku Singh"), WK("Phil Salt", "England", true),
    AR("Harshit Rana"), BW("Mitchell Starc", "Australia", true), B("Rahmanullah Gurbaz", "Afghanistan", true),
    B("Angkrish Raghuvanshi"), AR("Ramandeep Singh"), WK("KS Bharat"),
    AR("Anukul Roy"), BW("Vaibhav Arora"), AR("Suyash Sharma"),
    BW("Dushmantha Chameera", "Sri Lanka", true), B("Manish Pandey"),
    BW("Chetan Sakariya"), AR("Gus Atkinson", "England", true),
  ],
  dc: [
    WK("Rishabh Pant"), AR("Axar Patel"), B("David Warner", "Australia", true),
    B("Prithvi Shaw"), AR("Lalit Yadav"), BW("Anrich Nortje", "South Africa", true),
    BW("Kuldeep Yadav"), WK("Abishek Porel"), B("Tristan Stubbs", "South Africa", true),
    AR("Mitchell Marsh", "Australia", true), BW("Mukesh Kumar"),
    BW("Ishant Sharma"), BW("Khaleel Ahmed"), AR("Sumit Kumar"),
    B("Shai Hope", "West Indies", true), BW("Rasikh Salam"),
    AR("Ricky Bhui"), B("Swastik Chikara"), AR("Vicky Ostwal"),
    BW("Jhye Richardson", "Australia", true), B("Harry Brook", "England", true),
  ],
  srh: [
    B("Travis Head", "Australia", true), WK("Heinrich Klaasen", "South Africa", true),
    AR("Abhishek Sharma"), BW("Bhuvneshwar Kumar"), BW("Pat Cummins", "Australia", true),
    AR("Nitish Kumar Reddy"), B("Rahul Tripathi"), AR("Aiden Markram", "South Africa", true),
    WK("Glenn Phillips", "New Zealand", true), BW("T Natarajan"),
    BW("Jaydev Unadkat"), AR("Abdul Samad"), BW("Umran Malik"),
    B("Mayank Agarwal"), AR("Wanindu Hasaranga", "Sri Lanka", true),
    BW("Marco Jansen", "South Africa", true), BW("Shahbaz Ahmed"),
    WK("Upendra Yadav"), AR("Sanvir Singh"), B("Anmolpreet Singh"),
  ],
  rr: [
    WK("Sanju Samson"), B("Yashasvi Jaiswal"), B("Jos Buttler", "England", true),
    AR("Riyan Parag"), AR("Shimron Hetmyer", "West Indies", true),
    BW("Yuzvendra Chahal"), AR("Ravichandran Ashwin"), WK("Dhruv Jurel"),
    BW("Trent Boult", "New Zealand", true), BW("Sandeep Sharma"),
    AR("Rovman Powell", "West Indies", true), B("Devdutt Padikkal"),
    AR("Shubham Dubey"), BW("Avesh Khan"), BW("Nandre Burger", "South Africa", true),
    AR("Navdeep Saini"), B("Kunal Rathore"), WK("Donovan Ferreira", "South Africa", true),
    AR("Tom Kohler-Cadmore", "England", true), BW("Keshav Maharaj", "South Africa", true),
  ],
  pbks: [
    B("Shikhar Dhawan"), AR("Liam Livingstone", "England", true),
    BW("Arshdeep Singh"), BW("Kagiso Rabada", "South Africa", true),
    AR("Sam Curran", "England", true), B("Jonny Bairstow", "England", true),
    WK("Jitesh Sharma"), B("Prabhsimran Singh"), AR("Shashank Singh"),
    BW("Harpreet Brar"), BW("Rahul Chahar"), AR("Rishi Dhawan"),
    BW("Nathan Ellis", "Australia", true), B("Atharva Taide"),
    AR("Sikandar Raza", "Zimbabwe", true), B("Rilee Rossouw", "South Africa", true),
    AR("Chris Woakes", "England", true), AR("Ashutosh Sharma"),
    WK("Matthew Short", "Australia", true), BW("Vidwath Kaverappa"),
    B("Shivam Singh"),
  ],
  gt: [
    B("Shubman Gill"), BW("Rashid Khan", "Afghanistan", true), AR("Hardik Pandya"),
    B("Sai Sudharsan"), AR("Rahul Tewatia"), WK("Wriddhiman Saha"),
    AR("David Miller", "South Africa", true), B("Matthew Wade", "Australia", true),
    BW("Mohammed Shami"), BW("Noor Ahmad", "Afghanistan", true),
    AR("Vijay Shankar"), BW("Mohit Sharma"), AR("Darshan Nalkande"),
    B("Kane Williamson", "New Zealand", true), AR("Shahrukh Khan"),
    BW("Umesh Yadav"), BW("Joshua Little", "Ireland", true),
    AR("Azmatullah Omarzai", "Afghanistan", true), WK("Kartik Tyagi"),
    BW("Manav Suthar"), B("Sushant Mishra"), AR("BR Sharath"),
  ],
  lsg: [
    B("KL Rahul"), WK("Quinton de Kock", "South Africa", true), AR("Marcus Stoinis", "Australia", true),
    BW("Ravi Bishnoi"), BW("Avesh Khan"), BW("Mark Wood", "England", true),
    B("Devdutt Padikkal"), AR("Krunal Pandya"), WK("Nicholas Pooran", "West Indies", true),
    AR("Deepak Hooda"), BW("Mohsin Khan"), B("Ayush Badoni"),
    BW("Mayank Yadav"), AR("Yash Thakur"), B("Kyle Mayers", "West Indies", true),
    AR("Krishnappa Gowtham"), WK("Arshad Khan"), BW("Naveen-ul-Haq", "Afghanistan", true),
    B("Prerak Mankad"), AR("Amit Mishra"), BW("Shamar Joseph", "West Indies", true),
    B("Arshin Kulkarni"), AR("Matt Henry", "New Zealand", true),
  ],
};

// ===================== IPL 2015 (retain from 2014 squads) =====================
const SQUADS_2014: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("R Ashwin"),
    AR("Dwayne Bravo", "West Indies", true), B("Faf du Plessis", "South Africa", true),
    BW("Mohit Sharma"), B("Brendon McCullum", "New Zealand", true),
    AR("Pawan Negi"), B("Murali Vijay"), WK("Wriddhiman Saha"),
    BW("Ishwar Pandey"), AR("David Hussey", "Australia", true),
    B("Michael Hussey", "Australia", true), BW("Ben Hilfenhaus", "Australia", true),
    AR("Chris Morris", "South Africa", true), B("S Badrinath"),
  ],
  mi: [
    B("Rohit Sharma"), AR("Kieron Pollard", "West Indies", true), BW("Lasith Malinga", "Sri Lanka", true),
    B("Ambati Rayudu"), BW("Harbhajan Singh"), AR("Corey Anderson", "New Zealand", true),
    WK("Aditya Tare"), BW("Pragyan Ojha"), BW("Zaheer Khan"),
    AR("Glenn Maxwell", "Australia", true), WK("CM Gautam"), BW("Dhawal Kulkarni"),
    AR("Lendl Simmons", "West Indies", true), AR("Ben Dunk", "Australia", true),
    B("Michael Hussey", "Australia", true), AR("Unmukt Chand"),
    BW("Jasprit Bumrah"), B("Shreyas Gopal"),
  ],
  rcb: [
    B("Virat Kohli"), B("Chris Gayle", "West Indies", true), WK("AB de Villiers", "South Africa", true),
    BW("Yuzvendra Chahal"), AR("Albie Morkel", "South Africa", true),
    AR("Muttiah Muralitharan", "Sri Lanka", true), B("Parthiv Patel"),
    AR("Mitchell Starc", "Australia", true), BW("Varun Aaron"),
    AR("Ravi Rampaul", "West Indies", true), B("Yuvraj Singh"),
    B("Sachin Baby"), BW("Harshal Patel"), B("Mandeep Singh"),
    AR("Manan Vohra"), WK("Dinesh Karthik"),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Sunil Narine", "West Indies", true), AR("Jacques Kallis", "South Africa", true),
    AR("Yusuf Pathan"), B("Manish Pandey"), AR("Shakib Al Hasan", "Bangladesh", true),
    WK("Robin Uthappa"), AR("Rajat Bhatia"), BW("Morne Morkel", "South Africa", true),
    BW("Umesh Yadav"), WK("Surya Kumar Yadav"), B("Ryan ten Doeschate", "Netherlands", true),
    BW("Piyush Chawla"), AR("Andre Russell", "West Indies", true),
    B("Manvinder Bisla"), BW("Pat Cummins", "Australia", true),
  ],
  dd: [
    B("Virender Sehwag"), AR("Kevin Pietersen", "England", true), WK("Quinton de Kock", "South Africa", true),
    B("Dinesh Karthik"), BW("Imran Tahir", "South Africa", true),
    AR("JP Duminy", "South Africa", true), BW("Mohammad Shami"),
    BW("Shahbaz Nadeem"), AR("Kedar Jadhav"), B("Manoj Tiwary"),
    AR("Murali Vijay"), BW("Wayne Parnell", "South Africa", true),
    BW("Rahul Shukla"), B("Mayank Agarwal"), BW("Jaydev Unadkat"),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Ajinkya Rahane"), WK("Sanju Samson"),
    AR("Stuart Binny"), AR("James Faulkner", "Australia", true),
    B("Steve Smith", "Australia", true), AR("Kevon Cooper", "West Indies", true),
    BW("Pravin Tambe"), WK("Dishant Yagnik"), B("Karun Nair"),
    BW("Kane Richardson", "Australia", true), AR("Brad Hodge", "Australia", true),
    BW("Chris Morris", "South Africa", true), B("Abhishek Nayar"),
    AR("Rajat Bhatia"), BW("Tim Southee", "New Zealand", true),
  ],
  kxip: [
    AR("Glenn Maxwell", "Australia", true), B("Virender Sehwag"),
    AR("David Miller", "South Africa", true), WK("Wriddhiman Saha"),
    BW("Sandeep Sharma"), AR("Akshar Patel"), B("Manan Vohra"),
    BW("Parvinder Awana"), AR("Laxmipathy Balaji"), B("Cheteshwar Pujara"),
    AR("George Bailey", "Australia", true), BW("Mitchell Johnson", "Australia", true),
    B("Virender Sehwag"), AR("Murali Vijay"), WK("Wriddhiman Saha"),
    BW("Rishi Dhawan"), B("Mandeep Singh"),
  ],
  srh: [
    B("David Warner", "Australia", true), B("Shikhar Dhawan"), BW("Bhuvneshwar Kumar"),
    BW("Dale Steyn", "South Africa", true), WK("Parthiv Patel"),
    AR("Darren Sammy", "West Indies", true), BW("Amit Mishra"),
    BW("Ishant Sharma"), AR("Irfan Pathan"), AR("Karn Sharma"),
    B("Aaron Finch", "Australia", true), WK("Naman Ojha"),
    B("KS Williamson", "New Zealand", true), AR("Moises Henriques", "Australia", true),
    BW("Siddarth Kaul"), AR("Ravi Bopara", "England", true),
  ],
};

// ===================== IPL 2016 (retain from 2015 squads) =====================
const SQUADS_2015: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), BW("R Ashwin"),
    AR("Dwayne Bravo", "West Indies", true), B("Faf du Plessis", "South Africa", true),
    B("Brendon McCullum", "New Zealand", true), BW("Mohit Sharma"),
    B("Michael Hussey", "Australia", true), AR("Pawan Negi"),
    WK("Wriddhiman Saha"), BW("Ishwar Pandey"), AR("David Hussey", "Australia", true),
    B("S Badrinath"), AR("Chris Morris", "South Africa", true),
  ],
  mi: [
    B("Rohit Sharma"), AR("Kieron Pollard", "West Indies", true), BW("Lasith Malinga", "Sri Lanka", true),
    B("Ambati Rayudu"), BW("Harbhajan Singh"), AR("Corey Anderson", "New Zealand", true),
    BW("Jasprit Bumrah"), AR("Hardik Pandya"), AR("Lendl Simmons", "West Indies", true),
    WK("Parthiv Patel"), BW("Pragyan Ojha"), BW("Vinay Kumar"),
    BW("Mitchell McClenaghan", "New Zealand", true), AR("Unmukt Chand"),
    B("Shreyas Gopal"), WK("Aditya Tare"),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), B("Chris Gayle", "West Indies", true),
    BW("Yuzvendra Chahal"), AR("Shane Watson", "Australia", true),
    B("Mandeep Singh"), WK("Dinesh Karthik"), BW("Harshal Patel"),
    AR("Stuart Binny"), BW("Varun Aaron"), B("Sachin Baby"),
    AR("Mitchell Starc", "Australia", true), AR("David Wiese", "South Africa", true),
    B("Sarfaraz Khan"), BW("Iqbal Abdulla"),
  ],
  kkr: [
    B("Gautam Gambhir"), AR("Sunil Narine", "West Indies", true), AR("Andre Russell", "West Indies", true),
    AR("Yusuf Pathan"), B("Manish Pandey"), WK("Robin Uthappa"),
    BW("Morne Morkel", "South Africa", true), BW("Umesh Yadav"),
    BW("Piyush Chawla"), WK("Surya Kumar Yadav"), AR("Shakib Al Hasan", "Bangladesh", true),
    B("Ryan ten Doeschate", "Netherlands", true), AR("Rajat Bhatia"),
    B("Manvinder Bisla"), BW("Pat Cummins", "Australia", true),
  ],
  dd: [
    B("Virender Sehwag"), WK("Quinton de Kock", "South Africa", true), AR("JP Duminy", "South Africa", true),
    BW("Imran Tahir", "South Africa", true), BW("Amit Mishra"),
    B("Mayank Agarwal"), AR("Angelo Mathews", "Sri Lanka", true),
    AR("Yuvraj Singh"), BW("Nathan Coulter-Nile", "Australia", true),
    B("Shreyas Iyer"), WK("Rishabh Pant"), AR("Chris Morris", "South Africa", true),
    BW("Shahbaz Nadeem"), B("Kedar Jadhav"),
  ],
  rr: [
    AR("Shane Watson", "Australia", true), B("Ajinkya Rahane"), WK("Sanju Samson"),
    B("Steve Smith", "Australia", true), AR("James Faulkner", "Australia", true),
    AR("Stuart Binny"), BW("Pravin Tambe"), WK("Dishant Yagnik"),
    B("Karun Nair"), AR("Chris Morris", "South Africa", true),
    BW("Tim Southee", "New Zealand", true), BW("Dhawal Kulkarni"),
    B("Deepak Hooda"), AR("Brad Hodge", "Australia", true),
  ],
  kxip: [
    AR("Glenn Maxwell", "Australia", true), AR("David Miller", "South Africa", true),
    WK("Wriddhiman Saha"), AR("Axar Patel"), BW("Sandeep Sharma"),
    B("Manan Vohra"), B("Murali Vijay"), B("Shaun Marsh", "Australia", true),
    BW("Parvinder Awana"), AR("George Bailey", "Australia", true),
    AR("Marcus Stoinis", "Australia", true), BW("Anureet Singh"),
    B("Gurkeerat Singh"), BW("Rishi Dhawan"), B("Mandeep Singh"),
  ],
  srh: [
    B("David Warner", "Australia", true), B("Shikhar Dhawan"), BW("Bhuvneshwar Kumar"),
    BW("Dale Steyn", "South Africa", true), AR("Moises Henriques", "Australia", true),
    WK("Naman Ojha"), BW("Karn Sharma"), B("Kane Williamson", "New Zealand", true),
    AR("Deepak Hooda"), BW("Trent Boult", "New Zealand", true),
    AR("Ravi Bopara", "England", true), BW("Praveen Kumar"),
    AR("Ben Cutting", "Australia", true), B("Eoin Morgan", "England", true),
  ],
};

// ===================== IPL 2019 (retain from 2018 squads) =====================
const SQUADS_2018: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), AR("Dwayne Bravo", "West Indies", true),
    B("Ambati Rayudu"), B("Shane Watson", "Australia", true), BW("Deepak Chahar"),
    BW("Shardul Thakur"), BW("Lungi Ngidi", "South Africa", true),
    AR("Sam Billings", "England", true), B("Murali Vijay"), B("Faf du Plessis", "South Africa", true),
    AR("Mark Wood", "England", true), BW("Imran Tahir", "South Africa", true),
    BW("KM Asif"), BW("Harbhajan Singh"), AR("Kedar Jadhav"),
    BW("Karn Sharma"), WK("N Jagadeesan"),
  ],
  mi: [
    B("Rohit Sharma"), AR("Hardik Pandya"), BW("Jasprit Bumrah"),
    AR("Kieron Pollard", "West Indies", true), AR("Krunal Pandya"),
    B("Suryakumar Yadav"), WK("Ishan Kishan"), BW("Mitchell McClenaghan", "New Zealand", true),
    AR("Ben Cutting", "Australia", true), B("Evin Lewis", "West Indies", true),
    AR("JP Duminy", "South Africa", true), WK("Aditya Tare"),
    BW("Mustafizur Rahman", "Bangladesh", true), B("Mayank Markande"),
    BW("Rahul Chahar"), AR("Siddhesh Lad"), B("Anmolpreet Singh"),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), BW("Yuzvendra Chahal"),
    AR("Washington Sundar"), B("Brendon McCullum", "New Zealand", true),
    AR("Moeen Ali", "England", true), AR("Colin de Grandhomme", "New Zealand", true),
    BW("Umesh Yadav"), WK("Quinton de Kock", "South Africa", true),
    B("Mandeep Singh"), AR("Corey Anderson", "New Zealand", true),
    AR("Chris Woakes", "England", true), B("Manan Vohra"),
    BW("Mohammed Siraj"), BW("Navdeep Saini"), B("Sarfaraz Khan"),
    BW("Tim Southee", "New Zealand", true), AR("Pawan Negi"),
  ],
  kkr: [
    AR("Sunil Narine", "West Indies", true), AR("Andre Russell", "West Indies", true),
    WK("Dinesh Karthik"), WK("Robin Uthappa"), B("Chris Lynn", "Australia", true),
    B("Nitish Rana"), AR("Shubman Gill"), BW("Kuldeep Yadav"),
    BW("Piyush Chawla"), AR("Mitchell Starc", "Australia", true),
    B("Rinku Singh"), AR("Tom Curran", "England", true),
    B("Javon Searles", "West Indies", true), BW("Prasidh Krishna"),
    AR("Cameron Delport", "South Africa", true), AR("Apoorv Wankhade"),
  ],
  dd: [
    B("Shreyas Iyer"), WK("Rishabh Pant"), AR("Chris Morris", "South Africa", true),
    B("Prithvi Shaw"), AR("Glenn Maxwell", "Australia", true),
    BW("Amit Mishra"), BW("Trent Boult", "New Zealand", true),
    AR("Colin Munro", "New Zealand", true), B("Jason Roy", "England", true),
    AR("Vijay Shankar"), AR("Rahul Tewatia"), BW("Avesh Khan"),
    BW("Shahbaz Nadeem"), WK("Gautam Gambhir"), B("Harshal Patel"),
    B("Manjot Kalra"), BW("Daniel Vettori", "New Zealand", true),
  ],
  rr: [
    B("Ajinkya Rahane"), AR("Ben Stokes", "England", true), WK("Jos Buttler", "England", true),
    WK("Sanju Samson"), BW("Jaydev Unadkat"), AR("Krishnappa Gowtham"),
    AR("Stuart Binny"), B("D'Arcy Short", "Australia", true),
    BW("Jofra Archer", "England", true), B("Rahul Tripathi"),
    AR("Heinrich Klaasen", "South Africa", true), B("Steve Smith", "Australia", true),
    BW("Dhawal Kulkarni"), AR("Shreyas Gopal"), B("Prashant Chopra"),
    BW("Ish Sodhi", "New Zealand", true), AR("Mahipal Lomror"),
  ],
  kxip: [
    B("KL Rahul"), AR("Chris Gayle", "West Indies", true), B("Mayank Agarwal"),
    AR("Andrew Tye", "Australia", true), BW("Mujeeb Ur Rahman", "Afghanistan", true),
    BW("Ankit Rajpoot"), WK("Marcus Stoinis", "Australia", true),
    AR("Axar Patel"), AR("Ravichandran Ashwin"), B("Aaron Finch", "Australia", true),
    B("Karun Nair"), AR("David Miller", "South Africa", true),
    BW("Mohit Sharma"), AR("Barinder Sran"), BW("Manoj Tiwary"),
    B("Yuvraj Singh"), WK("Nicholas Pooran", "West Indies", true),
  ],
  srh: [
    B("David Warner", "Australia", true), BW("Bhuvneshwar Kumar"), B("Shikhar Dhawan"),
    BW("Rashid Khan", "Afghanistan", true), B("Kane Williamson", "New Zealand", true),
    BW("Siddarth Kaul"), AR("Shakib Al Hasan", "Bangladesh", true),
    B("Manish Pandey"), AR("Yusuf Pathan"), WK("Wriddhiman Saha"),
    AR("Deepak Hooda"), BW("Sandeep Sharma"), AR("Carlos Brathwaite", "West Indies", true),
    BW("Basil Thampi"), AR("Mohammad Nabi", "Afghanistan", true),
    AR("Sachin Baby"), WK("Shreevats Goswami"),
    B("Alex Hales", "England", true), BW("Billy Stanlake", "Australia", true),
  ],
};

// ===================== IPL 2020 (retain from 2019 squads) =====================
const SQUADS_2019: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), AR("Dwayne Bravo", "West Indies", true),
    B("Ambati Rayudu"), B("Shane Watson", "Australia", true), BW("Deepak Chahar"),
    BW("Shardul Thakur"), B("Faf du Plessis", "South Africa", true),
    BW("Imran Tahir", "South Africa", true), BW("Harbhajan Singh"),
    AR("Kedar Jadhav"), WK("N Jagadeesan"), BW("KM Asif"),
    AR("Mitchell Santner", "New Zealand", true), BW("Lungi Ngidi", "South Africa", true),
    BW("Mohit Sharma"), AR("Sam Billings", "England", true), B("Murali Vijay"),
  ],
  mi: [
    B("Rohit Sharma"), AR("Hardik Pandya"), BW("Jasprit Bumrah"),
    AR("Kieron Pollard", "West Indies", true), AR("Krunal Pandya"),
    B("Suryakumar Yadav"), WK("Quinton de Kock", "South Africa", true),
    WK("Ishan Kishan"), BW("Rahul Chahar"), BW("Lasith Malinga", "Sri Lanka", true),
    B("Aditya Tare"), AR("Ben Cutting", "Australia", true),
    BW("Mitchell McClenaghan", "New Zealand", true), B("Anmolpreet Singh"),
    AR("Jayant Yadav"), B("Siddhesh Lad"),
    AR("Barinder Sran"), BW("Alzarri Joseph", "West Indies", true),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), BW("Yuzvendra Chahal"),
    AR("Washington Sundar"), AR("Moeen Ali", "England", true),
    BW("Umesh Yadav"), WK("Parthiv Patel"), BW("Navdeep Saini"),
    BW("Mohammed Siraj"), B("Shimron Hetmyer", "West Indies", true),
    AR("Shivam Dube"), AR("Pawan Negi"), B("Gurkeerat Singh"),
    AR("Marcus Stoinis", "Australia", true), BW("Dale Steyn", "South Africa", true),
    B("Devdutt Padikkal"), AR("Colin de Grandhomme", "New Zealand", true),
    AR("Shahbaz Ahmed"), AR("Isuru Udana", "Sri Lanka", true),
  ],
  kkr: [
    AR("Sunil Narine", "West Indies", true), AR("Andre Russell", "West Indies", true),
    WK("Dinesh Karthik"), B("Shubman Gill"), B("Nitish Rana"),
    BW("Kuldeep Yadav"), AR("Carlos Brathwaite", "West Indies", true),
    BW("Prasidh Krishna"), BW("Lockie Ferguson", "New Zealand", true),
    B("Rinku Singh"), AR("Chris Lynn", "Australia", true),
    BW("Harry Gurney", "England", true), WK("Robin Uthappa"),
    BW("Piyush Chawla"), BW("Sandeep Warrier"), AR("Nikhil Naik"),
  ],
  dc: [
    B("Shreyas Iyer"), WK("Rishabh Pant"), B("Shikhar Dhawan"),
    BW("Kagiso Rabada", "South Africa", true), AR("Chris Morris", "South Africa", true),
    AR("Axar Patel"), B("Prithvi Shaw"), BW("Amit Mishra"),
    AR("Colin Ingram", "South Africa", true), AR("Keemo Paul", "West Indies", true),
    BW("Ishant Sharma"), BW("Avesh Khan"), AR("Harshal Patel"),
    AR("Trent Boult", "New Zealand", true), BW("Sandeep Lamichhane", "Nepal", true),
    B("Colin Munro", "New Zealand", true), BW("Shahbaz Nadeem"),
  ],
  srh: [
    B("David Warner", "Australia", true), BW("Bhuvneshwar Kumar"),
    BW("Rashid Khan", "Afghanistan", true), B("Kane Williamson", "New Zealand", true),
    B("Manish Pandey"), BW("Siddarth Kaul"), WK("Jonny Bairstow", "England", true),
    AR("Vijay Shankar"), AR("Deepak Hooda"), BW("Sandeep Sharma"),
    AR("Mohammad Nabi", "Afghanistan", true), WK("Wriddhiman Saha"),
    AR("Yusuf Pathan"), BW("Basil Thampi"), AR("Shakib Al Hasan", "Bangladesh", true),
    B("Martin Guptill", "New Zealand", true), WK("Shreevats Goswami"),
    BW("Khaleel Ahmed"), BW("Billy Stanlake", "Australia", true),
  ],
  rr: [
    B("Ajinkya Rahane"), WK("Jos Buttler", "England", true), AR("Ben Stokes", "England", true),
    WK("Sanju Samson"), BW("Jofra Archer", "England", true), B("Steve Smith", "Australia", true),
    BW("Jaydev Unadkat"), AR("Krishnappa Gowtham"), AR("Stuart Binny"),
    AR("Shreyas Gopal"), BW("Dhawal Kulkarni"), B("Rahul Tripathi"),
    AR("Riyan Parag"), B("Liam Livingstone", "England", true),
    BW("Ish Sodhi", "New Zealand", true), AR("Mahipal Lomror"),
    AR("Shashank Singh"), WK("Prashant Chopra"),
  ],
  kxip: [
    B("KL Rahul"), AR("Chris Gayle", "West Indies", true), B("Mayank Agarwal"),
    BW("Mohammed Shami"), AR("Sam Curran", "England", true),
    AR("Ravichandran Ashwin"), B("Mandeep Singh"), WK("Nicholas Pooran", "West Indies", true),
    AR("David Miller", "South Africa", true), BW("Mujeeb Ur Rahman", "Afghanistan", true),
    BW("Andrew Tye", "Australia", true), AR("Axar Patel"),
    AR("Hardus Viljoen", "South Africa", true), B("Karun Nair"),
    BW("Ankit Rajpoot"), WK("Prabhsimran Singh"),
    B("Sarfaraz Khan"), B("Arshdeep Singh"),
  ],
};

// ===================== IPL 2021 (retain from 2020 squads) =====================
const SQUADS_2020: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Suresh Raina"), AR("Ravindra Jadeja"), B("Ambati Rayudu"),
    B("Shane Watson", "Australia", true), BW("Deepak Chahar"),
    B("Faf du Plessis", "South Africa", true), BW("Shardul Thakur"),
    BW("Imran Tahir", "South Africa", true), AR("Dwayne Bravo", "West Indies", true),
    AR("Sam Curran", "England", true), AR("Kedar Jadhav"),
    WK("N Jagadeesan"), BW("Lungi Ngidi", "South Africa", true),
    AR("Mitchell Santner", "New Zealand", true), BW("Josh Hazlewood", "Australia", true),
    B("Ruturaj Gaikwad"), AR("Moeen Ali", "England", true),
    BW("KM Asif"), B("Robin Uthappa"),
  ],
  mi: [
    B("Rohit Sharma"), BW("Jasprit Bumrah"), AR("Hardik Pandya"),
    AR("Kieron Pollard", "West Indies", true), B("Suryakumar Yadav"),
    AR("Krunal Pandya"), WK("Quinton de Kock", "South Africa", true),
    WK("Ishan Kishan"), BW("Trent Boult", "New Zealand", true),
    BW("Rahul Chahar"), B("Saurabh Tiwary"), WK("Aditya Tare"),
    BW("Dhawal Kulkarni"), BW("Nathan Coulter-Nile", "Australia", true),
    AR("James Pattinson", "Australia", true), AR("Chris Lynn", "Australia", true),
    B("Anmolpreet Singh"), AR("Jayant Yadav"),
  ],
  rcb: [
    B("Virat Kohli"), WK("AB de Villiers", "South Africa", true), BW("Yuzvendra Chahal"),
    AR("Washington Sundar"), AR("Moeen Ali", "England", true),
    BW("Navdeep Saini"), BW("Mohammed Siraj"), B("Devdutt Padikkal"),
    AR("Shivam Dube"), AR("Chris Morris", "South Africa", true),
    AR("Aaron Finch", "Australia", true), BW("Dale Steyn", "South Africa", true),
    B("Gurkeerat Singh"), AR("Shahbaz Ahmed"), BW("Isuru Udana", "Sri Lanka", true),
    AR("Adam Zampa", "Australia", true), WK("Joshua Philippe", "Australia", true),
    BW("Kane Richardson", "Australia", true), B("Pawan Negi"),
  ],
  kkr: [
    AR("Andre Russell", "West Indies", true), AR("Sunil Narine", "West Indies", true),
    WK("Dinesh Karthik"), B("Shubman Gill"), B("Nitish Rana"),
    AR("Pat Cummins", "Australia", true), B("Eoin Morgan", "England", true),
    AR("Rahul Tripathi"), BW("Varun Chakaravarthy"), BW("Prasidh Krishna"),
    BW("Lockie Ferguson", "New Zealand", true), BW("Kuldeep Yadav"),
    AR("Tom Banton", "England", true), BW("Sandeep Warrier"),
    B("Rinku Singh"), AR("Chris Green", "Australia", true),
    B("Siddhesh Lad"), AR("Kamlesh Nagarkoti"),
  ],
  dc: [
    B("Shreyas Iyer"), WK("Rishabh Pant"), B("Shikhar Dhawan"),
    BW("Kagiso Rabada", "South Africa", true), B("Prithvi Shaw"),
    AR("Marcus Stoinis", "Australia", true), AR("Axar Patel"),
    AR("R Ashwin"), BW("Anrich Nortje", "South Africa", true),
    BW("Ishant Sharma"), BW("Avesh Khan"), AR("Harshal Patel"),
    B("Ajinkya Rahane"), AR("Keemo Paul", "West Indies", true),
    BW("Sandeep Lamichhane", "Nepal", true), AR("Lalit Yadav"),
    B("Shimron Hetmyer", "West Indies", true), WK("Alex Carey", "Australia", true),
    AR("Daniel Sams", "Australia", true), BW("Tushar Deshpande"),
  ],
  srh: [
    B("David Warner", "Australia", true), BW("Bhuvneshwar Kumar"),
    BW("Rashid Khan", "Afghanistan", true), B("Kane Williamson", "New Zealand", true),
    B("Manish Pandey"), WK("Jonny Bairstow", "England", true),
    AR("Jason Holder", "West Indies", true), AR("Abdul Samad"),
    BW("T Natarajan"), BW("Sandeep Sharma"), AR("Vijay Shankar"),
    WK("Wriddhiman Saha"), BW("Siddarth Kaul"), AR("Mohammad Nabi", "Afghanistan", true),
    BW("Khaleel Ahmed"), B("Priyam Garg"), AR("Mitchell Marsh", "Australia", true),
    WK("Shreevats Goswami"), AR("Abhishek Sharma"),
  ],
  rr: [
    WK("Sanju Samson"), B("Jos Buttler", "England", true), AR("Ben Stokes", "England", true),
    B("Steve Smith", "Australia", true), B("Yashasvi Jaiswal"),
    BW("Jofra Archer", "England", true), AR("Rahul Tewatia"),
    BW("Jaydev Unadkat"), AR("Riyan Parag"), AR("Shreyas Gopal"),
    B("David Miller", "South Africa", true), BW("Kartik Tyagi"),
    AR("Andrew Tye", "Australia", true), AR("Tom Curran", "England", true),
    B("Manan Vohra"), AR("Shivam Dube"), B("Robin Uthappa"),
    BW("Ankit Rajpoot"), B("Mahipal Lomror"),
    AR("Chris Morris", "South Africa", true),
  ],
  pbks: [
    B("KL Rahul"), AR("Chris Gayle", "West Indies", true), B("Mayank Agarwal"),
    BW("Mohammed Shami"), AR("Nicholas Pooran", "West Indies", true),
    AR("Glenn Maxwell", "Australia", true), B("Mandeep Singh"),
    BW("Mujeeb Ur Rahman", "Afghanistan", true), BW("Ravi Bishnoi"),
    AR("Chris Jordan", "England", true), AR("Deepak Hooda"),
    AR("Sarfaraz Khan"), BW("Arshdeep Singh"), AR("James Neesham", "New Zealand", true),
    WK("Prabhsimran Singh"), B("Simran Singh"), AR("Krishnappa Gowtham"),
    AR("Fabian Allen", "West Indies", true),
  ],
};

// ===================== IPL 2023 (retain from 2022 squads) =====================
const SQUADS_2022: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Ruturaj Gaikwad"), AR("Ravindra Jadeja"), AR("Moeen Ali", "England", true),
    BW("Deepak Chahar"), AR("Dwayne Bravo", "West Indies", true),
    B("Ambati Rayudu"), B("Robin Uthappa"), AR("Shivam Dube"),
    WK("N Jagadeesan"), BW("Tushar Deshpande"), BW("Maheesh Theekshana", "Sri Lanka", true),
    AR("Mitchell Santner", "New Zealand", true), BW("Simarjeet Singh"),
    AR("Rajvardhan Hangargekar"), B("Subhranshu Senapati"), BW("Mukesh Choudhary"),
    AR("Chris Jordan", "England", true), AR("Devon Conway", "New Zealand", true),
    BW("Adam Milne", "New Zealand", true), WK("Hari Nishanth"),
    BW("KM Asif"), AR("Prashant Solanki"),
  ],
  mi: [
    B("Rohit Sharma"), BW("Jasprit Bumrah"), B("Suryakumar Yadav"),
    WK("Ishan Kishan"), B("Tilak Varma"), AR("Tim David", "Singapore", true),
    AR("Daniel Sams", "Australia", true), BW("Jofra Archer", "England", true),
    BW("Riley Meredith", "Australia", true), AR("Murugan Ashwin"),
    AR("Hrithik Shokeen"), WK("Dewald Brevis", "South Africa", true),
    BW("Kumar Kartikeya"), AR("Ramandeep Singh"), B("Anmolpreet Singh"),
    BW("Fabian Allen", "West Indies", true), AR("Tristan Stubbs", "South Africa", true),
    AR("Sanjay Yadav"), B("Arjun Tendulkar"), WK("Rahul Buddhi"),
  ],
  rcb: [
    B("Virat Kohli"), B("Faf du Plessis", "South Africa", true), BW("Harshal Patel"),
    AR("Glenn Maxwell", "Australia", true), BW("Wanindu Hasaranga", "Sri Lanka", true),
    AR("Shahbaz Ahmed"), WK("Dinesh Karthik"), BW("Mohammed Siraj"),
    B("Anuj Rawat"), AR("David Willey", "England", true), B("Rajat Patidar"),
    AR("Mahipal Lomror"), BW("Akash Deep"), BW("Josh Hazlewood", "Australia", true),
    B("Suyash Prabhudessai"), AR("Karn Sharma"), B("Aneeshwar Gautam"),
    BW("Siddarth Kaul"), BW("Chama Milind"),
  ],
  kkr: [
    AR("Andre Russell", "West Indies", true), AR("Sunil Narine", "West Indies", true),
    BW("Varun Chakaravarthy"), AR("Venkatesh Iyer"), B("Shreyas Iyer"),
    B("Nitish Rana"), AR("Pat Cummins", "Australia", true),
    B("Sam Billings", "England", true), WK("Sheldon Jackson"),
    AR("Anukul Roy"), BW("Umesh Yadav"), BW("Tim Southee", "New Zealand", true),
    BW("Shivam Mavi"), AR("Rinku Singh"), B("Baba Indrajith"),
    AR("Chamika Karunaratne", "Sri Lanka", true), BW("Harshit Rana"),
    AR("Ramesh Kumar"), BW("Mohammad Nabi", "Afghanistan", true),
    B("Aaron Finch", "Australia", true), AR("Rasikh Salam"),
  ],
  dc: [
    WK("Rishabh Pant"), AR("Axar Patel"), B("Prithvi Shaw"),
    B("David Warner", "Australia", true), BW("Anrich Nortje", "South Africa", true),
    AR("Mitchell Marsh", "Australia", true), BW("Kuldeep Yadav"),
    AR("Shardul Thakur"), BW("Khaleel Ahmed"), WK("Sarfaraz Khan"),
    AR("Lalit Yadav"), B("Mandeep Singh"), BW("Mustafizur Rahman", "Bangladesh", true),
    BW("Chetan Sakariya"), AR("Ripal Patel"), B("Yash Dhull"),
    AR("Rovman Powell", "West Indies", true), BW("Lungi Ngidi", "South Africa", true),
    WK("KS Bharat"), B("Tim Seifert", "New Zealand", true),
    AR("Vicky Ostwal"),
  ],
  srh: [
    B("Kane Williamson", "New Zealand", true), AR("Abdul Samad"), BW("Umran Malik"),
    BW("Bhuvneshwar Kumar"), B("Rahul Tripathi"), AR("Washington Sundar"),
    WK("Nicholas Pooran", "West Indies", true), AR("Aiden Markram", "South Africa", true),
    BW("T Natarajan"), AR("Abhishek Sharma"), AR("Marco Jansen", "South Africa", true),
    BW("Kartik Tyagi"), B("Priyam Garg"), AR("Romario Shepherd", "West Indies", true),
    BW("Sean Abbott", "Australia", true), WK("Glenn Phillips", "New Zealand", true),
    B("Vishnu Vinod"), AR("Shashank Singh"), BW("Fazalhaq Farooqi", "Afghanistan", true),
    AR("Saurabh Dubey"),
  ],
  rr: [
    WK("Sanju Samson"), B("Jos Buttler", "England", true), B("Yashasvi Jaiswal"),
    AR("R Ashwin"), BW("Yuzvendra Chahal"), AR("Shimron Hetmyer", "West Indies", true),
    BW("Trent Boult", "New Zealand", true), AR("Riyan Parag"),
    B("Devdutt Padikkal"), WK("Dhruv Jurel"), BW("Prasidh Krishna"),
    AR("James Neesham", "New Zealand", true), BW("Obed McCoy", "West Indies", true),
    AR("Navdeep Saini"), B("Karun Nair"), BW("Kuldeep Sen"),
    AR("Daryl Mitchell", "New Zealand", true), AR("Nathan Coulter-Nile", "Australia", true),
    B("Rassie van der Dussen", "South Africa", true), WK("KC Cariappa"),
  ],
  pbks: [
    B("Mayank Agarwal"), AR("Liam Livingstone", "England", true),
    B("Shikhar Dhawan"), BW("Kagiso Rabada", "South Africa", true),
    BW("Arshdeep Singh"), AR("Shahrukh Khan"), WK("Jitesh Sharma"),
    AR("Odean Smith", "West Indies", true), BW("Rahul Chahar"),
    AR("Rishi Dhawan"), B("Prabhsimran Singh"), BW("Harpreet Brar"),
    AR("Nathan Ellis", "Australia", true), B("Atharva Taide"),
    B("Jonny Bairstow", "England", true), BW("Sandeep Sharma"),
    AR("Raj Bawa"), B("Bhanuka Rajapaksa", "Sri Lanka", true),
    WK("Writtick Chatterjee"), AR("Baltej Singh"),
  ],
  gt: [
    AR("Hardik Pandya"), B("Shubman Gill"), BW("Rashid Khan", "Afghanistan", true),
    AR("Rahul Tewatia"), B("David Miller", "South Africa", true),
    WK("Wriddhiman Saha"), BW("Mohammed Shami"), AR("Lockie Ferguson", "New Zealand", true),
    B("Matthew Wade", "Australia", true), AR("Vijay Shankar"),
    B("Sai Sudharsan"), AR("Yash Dayal"), BW("Alzarri Joseph", "West Indies", true),
    AR("Darshan Nalkande"), B("Abhinav Manohar"), WK("Pradeep Sangwan"),
    BW("Noor Ahmad", "Afghanistan", true), AR("Jayant Yadav"),
    B("Gurkeerat Singh"), BW("Varun Aaron"),
  ],
  lsg: [
    B("KL Rahul"), WK("Quinton de Kock", "South Africa", true),
    AR("Marcus Stoinis", "Australia", true), BW("Avesh Khan"),
    BW("Ravi Bishnoi"), BW("Mark Wood", "England", true),
    AR("Krunal Pandya"), AR("Jason Holder", "West Indies", true),
    AR("Deepak Hooda"), AR("Krishnappa Gowtham"), B("Ayush Badoni"),
    AR("Dushmantha Chameera", "Sri Lanka", true), BW("Mohsin Khan"),
    AR("Karan Sharma"), B("Evin Lewis", "West Indies", true),
    BW("Manan Vohra"), WK("Kyle Mayers", "West Indies", true),
    B("Manish Pandey"), AR("Andrew Tye", "Australia", true),
  ],
};

// ===================== IPL 2024 (retain from 2023 squads) =====================
const SQUADS_2023: Record<string, SquadPlayer[]> = {
  csk: [
    WK("MS Dhoni"), B("Ruturaj Gaikwad"), AR("Ravindra Jadeja"), AR("Moeen Ali", "England", true),
    BW("Deepak Chahar"), B("Ambati Rayudu"), AR("Shivam Dube"),
    WK("Devon Conway", "New Zealand", true), BW("Tushar Deshpande"),
    BW("Maheesh Theekshana", "Sri Lanka", true), AR("Mitchell Santner", "New Zealand", true),
    AR("Rajvardhan Hangargekar"), B("Subhranshu Senapati"), BW("Mukesh Choudhary"),
    BW("Simarjeet Singh"), WK("N Jagadeesan"), BW("Matheesha Pathirana", "Sri Lanka", true),
    AR("Ben Stokes", "England", true), AR("Ajinkya Rahane"),
    BW("Kyle Jamieson", "New Zealand", true), B("Shaik Rasheed"),
    AR("Prashant Solanki"), B("Ajeet Singh"),
  ],
  mi: [
    B("Rohit Sharma"), BW("Jasprit Bumrah"), B("Suryakumar Yadav"),
    WK("Ishan Kishan"), B("Tilak Varma"), AR("Tim David", "Singapore", true),
    AR("Cameron Green", "Australia", true), BW("Piyush Chawla"),
    AR("Hrithik Shokeen"), WK("Dewald Brevis", "South Africa", true),
    BW("Kumar Kartikeya"), B("Arjun Tendulkar"), BW("Akash Madhwal"),
    AR("Nehal Wadhera"), AR("Naman Dhir"), WK("Vishnu Vinod"),
    BW("Jason Behrendorff", "Australia", true), AR("Shams Mulani"),
    B("Anmolpreet Singh"), BW("Nuwan Thushara", "Sri Lanka", true),
    BW("Gerald Coetzee", "South Africa", true), AR("Romario Shepherd", "West Indies", true),
    BW("Dilshan Madushanka", "Sri Lanka", true), BW("Luke Wood", "England", true),
  ],
  rcb: [
    B("Virat Kohli"), B("Faf du Plessis", "South Africa", true), BW("Mohammed Siraj"),
    AR("Glenn Maxwell", "Australia", true), B("Rajat Patidar"),
    WK("Dinesh Karthik"), AR("Shahbaz Ahmed"), BW("Harshal Patel"),
    AR("David Willey", "England", true), BW("Akash Deep"),
    B("Anuj Rawat"), AR("Mahipal Lomror"), BW("Karn Sharma"),
    AR("Wayne Parnell", "South Africa", true), BW("Vyshak Vijaykumar"),
    B("Suyash Prabhudessai"), AR("Rajan Kumar"), WK("Avinash Singh"),
    AR("Himanshu Sharma"), BW("Reece Topley", "England", true),
  ],
  kkr: [
    AR("Andre Russell", "West Indies", true), AR("Sunil Narine", "West Indies", true),
    B("Shreyas Iyer"), BW("Varun Chakaravarthy"), AR("Venkatesh Iyer"),
    B("Nitish Rana"), B("Rinku Singh"), AR("Shardul Thakur"),
    WK("Rahmanullah Gurbaz", "Afghanistan", true), BW("Harshit Rana"),
    AR("Ramandeep Singh"), AR("Anukul Roy"), BW("Suyash Sharma"),
    WK("Narayan Jagadeesan"), B("Manish Pandey"),
    BW("Vaibhav Arora"), AR("David Wiese", "South Africa", true),
    AR("Lochan Tillaron"), B("Jason Roy", "England", true),
  ],
  dc: [
    WK("Rishabh Pant"), AR("Axar Patel"), B("David Warner", "Australia", true),
    B("Prithvi Shaw"), BW("Anrich Nortje", "South Africa", true),
    AR("Mitchell Marsh", "Australia", true), BW("Kuldeep Yadav"),
    WK("Abishek Porel"), B("Phil Salt", "England", true),
    AR("Lalit Yadav"), BW("Khaleel Ahmed"), BW("Mukesh Kumar"),
    BW("Ishant Sharma"), AR("Aman Khan"), B("Rilee Rossouw", "South Africa", true),
    AR("Vicky Ostwal"), AR("Sumit Kumar"), B("Yash Dhull"),
    AR("Pravin Dubey"), BW("Jhye Richardson", "Australia", true),
  ],
  srh: [
    B("Travis Head", "Australia", true), WK("Heinrich Klaasen", "South Africa", true),
    AR("Abhishek Sharma"), BW("Bhuvneshwar Kumar"),
    AR("Aiden Markram", "South Africa", true), AR("Abdul Samad"),
    BW("Umran Malik"), WK("Glenn Phillips", "New Zealand", true),
    BW("T Natarajan"), AR("Washington Sundar"), AR("Marco Jansen", "South Africa", true),
    BW("Kartik Tyagi"), B("Rahul Tripathi"), AR("Harry Brook", "England", true),
    BW("Fazalhaq Farooqi", "Afghanistan", true), AR("Nitish Kumar Reddy"),
    B("Mayank Agarwal"), AR("Anmolpreet Singh"), WK("Upendra Yadav"),
    AR("Sanvir Singh"), BW("Jaydev Unadkat"),
  ],
  rr: [
    WK("Sanju Samson"), B("Jos Buttler", "England", true), B("Yashasvi Jaiswal"),
    AR("Shimron Hetmyer", "West Indies", true), BW("Yuzvendra Chahal"),
    AR("R Ashwin"), AR("Riyan Parag"), WK("Dhruv Jurel"),
    BW("Trent Boult", "New Zealand", true), BW("Sandeep Sharma"),
    B("Devdutt Padikkal"), AR("Rovman Powell", "West Indies", true),
    BW("Obed McCoy", "West Indies", true), AR("Navdeep Saini"),
    BW("Kuldeep Sen"), AR("Jason Holder", "West Indies", true),
    B("Joe Root", "England", true), BW("Avesh Khan"),
    B("Kunal Rathore"), AR("Donovan Ferreira", "South Africa", true),
  ],
  pbks: [
    AR("Liam Livingstone", "England", true), B("Shikhar Dhawan"),
    BW("Arshdeep Singh"), BW("Kagiso Rabada", "South Africa", true),
    AR("Sam Curran", "England", true), B("Jonny Bairstow", "England", true),
    WK("Jitesh Sharma"), AR("Shahrukh Khan"), BW("Rahul Chahar"),
    AR("Rishi Dhawan"), B("Prabhsimran Singh"), BW("Harpreet Brar"),
    AR("Nathan Ellis", "Australia", true), B("Atharva Taide"),
    AR("Sikandar Raza", "Zimbabwe", true), BW("Vidwath Kaverappa"),
    B("Shivam Singh"), AR("Ashutosh Sharma"), AR("Mohit Rathee"),
  ],
  gt: [
    B("Shubman Gill"), BW("Rashid Khan", "Afghanistan", true), AR("Hardik Pandya"),
    B("Sai Sudharsan"), AR("Rahul Tewatia"), WK("Wriddhiman Saha"),
    AR("David Miller", "South Africa", true), B("Matthew Wade", "Australia", true),
    BW("Mohammed Shami"), BW("Noor Ahmad", "Afghanistan", true),
    AR("Vijay Shankar"), BW("Mohit Sharma"), AR("Darshan Nalkande"),
    B("Kane Williamson", "New Zealand", true), AR("Shahrukh Khan"),
    BW("Umesh Yadav"), BW("Joshua Little", "Ireland", true),
    AR("Azmatullah Omarzai", "Afghanistan", true), B("Abhinav Manohar"),
    BW("Manav Suthar"), BW("Spencer Johnson", "Australia", true),
  ],
  lsg: [
    B("KL Rahul"), WK("Quinton de Kock", "South Africa", true),
    AR("Marcus Stoinis", "Australia", true), BW("Ravi Bishnoi"),
    BW("Avesh Khan"), BW("Mark Wood", "England", true),
    AR("Krunal Pandya"), WK("Nicholas Pooran", "West Indies", true),
    AR("Deepak Hooda"), B("Ayush Badoni"), BW("Mohsin Khan"),
    BW("Naveen-ul-Haq", "Afghanistan", true), B("Kyle Mayers", "West Indies", true),
    AR("Krishnappa Gowtham"), BW("Yash Thakur"), B("Devdutt Padikkal"),
    BW("Mayank Yadav"), WK("Arshad Khan"),
    AR("Amit Mishra"), B("Prerak Mankad"),
  ],
};

// Export function to get previous season squad for a team in a given auction year
export function getPreviousSeasonSquad(auctionYear: string, teamId: string): SquadPlayer[] {
  let squads: Record<string, SquadPlayer[]> | undefined;
  
  switch (auctionYear) {
    case "IPL 2011": squads = SQUADS_2010; break;
    case "IPL 2012": squads = SQUADS_2011; break;
    case "IPL 2013": squads = SQUADS_2012; break;
    case "IPL 2014": squads = SQUADS_2013; break;
    case "IPL 2015": squads = SQUADS_2014; break;
    case "IPL 2016": squads = SQUADS_2015; break;
    case "IPL 2017": squads = SQUADS_2015; break; // same squads carried forward
    case "IPL 2018": squads = SQUADS_2017; break;
    case "IPL 2019": squads = SQUADS_2018; break;
    case "IPL 2020": squads = SQUADS_2019; break;
    case "IPL 2021": squads = SQUADS_2020; break;
    case "IPL 2022": squads = SQUADS_2021; break;
    case "IPL 2023": squads = SQUADS_2022; break;
    case "IPL 2024": squads = SQUADS_2023; break;
    case "IPL 2025": squads = SQUADS_2024; break;
    case "IPL 2026": squads = SQUADS_2024; break; // fallback
    default: return [];
  }

  // Handle team ID mapping for renamed/replaced teams
  // For 2018: CSK returns but players came from RPS (Dhoni) and GL (Raina, Jadeja)
  // For 2016: RPS gets CSK players, GL gets some RR/CSK players
  if (auctionYear === "IPL 2018" && teamId === "csk") {
    // CSK was suspended 2016-17; their retainable players come from RPS (who had CSK players)
    return squads["rps"] || [];
  }
  if (auctionYear === "IPL 2018" && teamId === "rr") {
    // RR was suspended 2016-17; they don't have a previous squad — treated as fresh
    return [];
  }
  if (auctionYear === "IPL 2016" && teamId === "rps") {
    // RPS was a replacement for CSK
    return squads["csk"] || [];
  }
  if (auctionYear === "IPL 2016" && teamId === "gl") {
    // GL was a replacement for RR
    return squads["rr"] || [];
  }
  
  // Handle DD → DC rename
  if (teamId === "dc" && squads["dd"] && !squads["dc"]) {
    return squads["dd"] || [];
  }
  if (teamId === "dd" && squads["dc"] && !squads["dd"]) {
    return squads["dc"] || [];
  }
  
  // Handle KXIP → PBKS rename
  if (teamId === "pbks" && squads["kxip"] && !squads["pbks"]) {
    return squads["kxip"] || [];
  }
  if (teamId === "kxip" && squads["pbks"] && !squads["pbks"]) {
    return squads["pbks"] || [];
  }

  return squads[teamId] || [];
}
