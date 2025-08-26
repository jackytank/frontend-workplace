import sys
import time
import math
import threading

# --- Dependency Check ---
# This is the recommended way to handle missing packages.
try:
    import pyautogui
    from pynput import mouse
except ImportError:
    print("-----------------------------------------------------------")
    print("ERROR: Missing required libraries.")
    print("Please install them by running this command in your terminal:")
    print("pip install pyautogui pynput")
    print("-----------------------------------------------------------")
    sys.exit()
# ------------------------


# --- Configuration ---
WIGGLE_INTERVAL_SECONDS = 5
PAUSE_AFTER_USER_MOVE_SECONDS = 5
CIRCLE_RADIUS = 30
WIGGLE_SPEED = 0.5
# ---------------------

last_user_move_time = [time.time()]

def on_move(x, y):
    last_user_move_time[0] = time.time()

mouse_listener = mouse.Listener(on_move=on_move)
listener_thread = threading.Thread(target=mouse_listener.run, daemon=True)
listener_thread.start()

print("Polite Mouse Wiggler is running.")
print(f"I will wiggle the mouse every {WIGGLE_INTERVAL_SECONDS} seconds if you are idle.")
print("Press Ctrl-C to exit.")

try:
    while True:
        time_since_last_move = time.time() - last_user_move_time[0]

        if time_since_last_move > PAUSE_AFTER_USER_MOVE_SECONDS:
            print("User is idle. Performing a wiggle...")
            original_x, original_y = pyautogui.position()

            for i in range(0, 361, 15):
                angle = math.radians(i)
                x = original_x + CIRCLE_RADIUS * math.cos(angle)
                y = original_y + CIRCLE_RADIUS * math.sin(angle)
                pyautogui.moveTo(x, y, duration=(WIGGLE_SPEED / 25))

            pyautogui.moveTo(original_x, original_y, duration=0.1)
            on_move(0, 0)

            print(f"Wiggle complete. Now monitoring for user activity...")
            time.sleep(WIGGLE_INTERVAL_SECONDS)
        else:
            time.sleep(1)

except KeyboardInterrupt:
    print("\nMouse Wiggler stopped.")