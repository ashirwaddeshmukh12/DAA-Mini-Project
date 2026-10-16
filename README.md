# SocialSphere — DAA Teaching Lab & Social Network Graph Visualizer

An interactive, beginner-friendly **Social Network Graph Visualizer & DAA Teaching Lab** engineered specifically for college microproject demonstrations, HOD/Teacher reviews, and viva examinations.

SocialSphere models a university student social network as an undirected graph $G = (V, E)$, where each student is a vertex ($V$) and each mutual friendship is an edge ($E$). It provides visual and interactive simulations of **Breadth-First Search (BFS)**, **Depth-First Search (DFS)**, **Unweighted Shortest Path**, and **Asymptotic Time Complexity** ($O(V + E)$).

---

## 🌟 The 5 Core Sections

The application is structured around 5 clear sections:

1. **Home / Graph**:
   - Interactive 2D SVG canvas displaying every student as a clearly labelled circle and friendships as lines.
   - Stable layout: nodes stay in place and never jump unexpectedly; nodes can be dragged to customize positioning.
   - Click any person to highlight them and their direct friends.
   - Simple side controls to add a person, connect two people, remove a connection, or delete a student.
   - Tiny legend: Circle = Person, Line = Friendship, Highlighted = Current/Selected, Gold = Shortest Path.

2. **BFS Simulator**:
   - Select any starting person (e.g. Aditi).
   - Step-by-step or auto-play Breadth-First Search traversal.
   - Live **FIFO Queue** showing who is waiting to be explored (`FRONT ➔ [ ... ] ➔ BACK`).
   - Visited order list (`Aditi → Rohan → Priya → ...`) and total visited count.
   - Clear explanations: *"BFS checks nearby people first"*, *"Queue stores people waiting to be visited"*, *"BFS explores the graph level by level"*.

3. **DFS Simulator**:
   - Select any starting person.
   - Real-time Depth-First Search following deep paths before backtracking.
   - Live **LIFO Call Stack** showing the current recursion path (`TOP ➔ [ ... ] ➔ BOTTOM`).
   - Visible **Backtracking Alert**: displays when a dead end is reached and the algorithm returns to explore remaining branches.
   - Clear explanations: *"DFS follows one path as far as possible"*, *"When there are no new neighbours, DFS goes back"*, *"Stack helps keep track of the path"*.

4. **Shortest Path**:
   - Select starting student and destination student.
   - Computes minimum friendship connections using unweighted BFS.
   - Highlights the path in radiant gold on the canvas with non-path nodes softly dimmed for classroom projector visibility.
   - Displays path string (e.g. `Aditi → Priya → Meera → Arjun → Neha`) and count (`Shortest path: 4 connections`).
   - Handles disconnected components gracefully (e.g. Aditi to Vikram) explaining why no path exists.

5. **Learn Algorithms**:
   - Clean, readable teaching page with simple definitions:
     - What is a Graph? *"A graph is a collection of people and the connections between them."*
     - What is a Vertex? *"A vertex is one person in our network."*
     - What is an Edge? *"An edge is a friendship between two people."*
     - What is BFS? *"BFS visits nearby people first using a Queue."*
     - What is DFS? *"DFS follows one path as far as possible and then goes back when needed."*
     - What is Shortest Path? *"It finds the minimum number of connections between two people."*
   - Side-by-side comparison between BFS and DFS with an example on the same friendship graph.
   - Clean pseudocode with step-by-step commentary.
   - **Time Complexity Made Easy**:
     - Explains $V$ (people), $E$ (friendships), and $O(V + E)$ operations.
     - Theoretical and space complexity table.
     - Concrete numbers on our graph ($V = 11$, $E = 13$, $O(24)$ operations).
     - Live measured runtime on hardware (~0.08 ms) labeled as observed empirical measurement.
   - Examiner Viva Prep: 4 top viva questions with concise answers.

---

## 🚀 Execution Instructions (macOS / VS Code)

### Option 1: One-Command Startup (Recommended)

From the project directory:
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d
chmod +x start.sh
./start.sh
```
*(Press `Ctrl + C` at any time to gracefully terminate both servers).*

---

### Option 2: Separate Terminals

#### Terminal 1 — FastAPI Backend:
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d/backend
source venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
- **Backend API URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### Terminal 2 — React + Vite Frontend:
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d/frontend
npm run dev
```
- **Frontend App URL:** [http://localhost:5173](http://localhost:5173)

---

## 🧪 Automated Testing

### Backend Unit Tests (Pytest):
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d/backend
source venv/bin/activate
pytest
```
*Result: 13 / 13 tests passed.*

### End-to-End Live Features Suite:
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d/backend
source venv/bin/activate
python test_live_features.py
```
*Result: 15 / 15 verifications passed.*

### Frontend Production Build:
```bash
cd /Users/devansh/Desktop/DAA/socialsphere-3d/frontend
npm run build
```
*Result: Clean bundle (221 kB), 0 errors.*

---

## 📊 Time Complexity Reference Table

| Algorithm | Data Structure | Time Complexity | Space Complexity |
| :--- | :--- | :---: | :---: |
| **BFS** | Queue (FIFO) | $O(V + E)$ | $O(V)$ |
| **DFS** | Stack / Recursion (LIFO) | $O(V + E)$ | $O(V)$ |
| **Shortest Path (BFS)** | Queue (FIFO) | $O(V + E)$ | $O(V)$ |

> **Why $O(V + E)$?**  
> BFS and DFS visit each vertex at most once and examine each adjacency-list entry a constant number of times. In an undirected graph with an adjacency list, each edge is examined once from each end ($2E$ checks). Therefore, total operations are $V + 2E = O(V + E)$.
