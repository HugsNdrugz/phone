// Define the main Angular module
var app = angular.module("app", []);

// Directive to handle scroll events for the expandable header
app.directive('onScrollEvent', function() {
    return {
        restrict: 'A', // Restrict to attribute
        link: function(scope, element, attrs) {
            // Attach a scroll event listener to the element
            element.on('scroll', function() {
                // Use $apply to ensure Angular's digest cycle runs and updates the view
                scope.$apply(function() {
                    // Evaluate the expression passed in the attribute, passing the scrollTop value
                    scope.$eval(attrs.onScrollEvent, {'scrollTop': element[0].scrollTop});
                });
            });
        }
    };
});

// Main Angular controller for the phone application
app.controller("ctrl", function($scope, $timeout) {

    // --- Third-Party Library Initializations ---

    // Initialize jQuery NiceScroll for custom scrollbars
    // This enhances the appearance of scrollable areas within the phone UI.
    $(function() {
        $(".contacts-wrapper ul, .call-wrapper .scroll-content, .twitter-wrapper .scroll-content, .messages-wrapper .scroll-content, .conversation-wrapper").niceScroll({
            cursorcolor: "rgba(255,255,255,0.3)", // Color of the scrollbar cursor
            cursorborder: "0px solid #fff",      // Border around the cursor
            cursoropacitymax: 0.5,               // Maximum opacity of the cursor
            cursorwidth: "3px"                   // Width of the cursor
        });
    });

    // Initialize Hammer.js for touch gestures on the phone screen
    // This enables swipe left/right for launcher page navigation.
    var phoneScreen = document.getElementById('phone-screen');
    var hammer = new Hammer(phoneScreen);

    // Listen for swipeleft gesture
    hammer.on('swipeleft', function() {
        // Only allow swiping if no application is currently open (i.e., on the home screen)
        if ($scope.currentView === null) {
            // Use $apply to trigger Angular's digest cycle after a non-Angular event
            $scope.$apply(function() {
                // Move to the next page if not on the last page
                if ($scope.currentPage < $scope.numPages - 1) {
                    $scope.currentPage++;
                }
            });
        }
    });

    // Listen for swiperight gesture
    hammer.on('swiperight', function() {
        // Only allow swiping if no application is currently open
        if ($scope.currentView === null) {
            $scope.$apply(function() {
                // Move to the previous page if not on the first page
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            });
        }
    });

    // --- UI State Management ---

    // Dark Mode state (true for dark, false for light)
    $scope.darkMode = false;

    // Header collapse states for individual applications
    // These booleans control the "expandable app bar" feature.
    $scope.contactsHeaderCollapsed = false;
    $scope.settingsHeaderCollapsed = false;
    // Add more header collapse states here as more apps are styled with One UI headers.

    // Launcher (home screen) page navigation
    $scope.currentPage = 0; // Current active page (0-indexed)
    $scope.numPages = 2;    // Total number of launcher pages

    // Tracks the currently active application view (e.g., 'contacts', 'settings', 'call')
    // This is crucial for the Android navigation bar's Back functionality.
    $scope.currentView = null;

    // Phone size settings
    $scope.sm = false; // Small zoom
    $scope.med = false; // Medium zoom
    $scope.lg = true;  // Large zoom (default active size)
    $scope.xl = false; // Extra large zoom
    // This object holds the selected phone size from the settings UI.
    $scope.screenSize = { name: "large" }; 

    // Initial state for all application toggle flags (all closed by default)
    $scope.callToggle = false;
    $scope.contactsToggle = false;
    $scope.messagesToggle = false;
    $scope.servicesToggle = false;
    $scope.settingsToggle = false;
    $scope.newMessageToggle = false;
    $scope.addContactToggle = false;
    $scope.lifeAlertToggle = false;
    $scope.twitterToggle = false;
    $scope.sendTweetToggle = false;
    $scope.serviceMessageToggle = false;
    $scope.loadingToggle = false;
    $scope.confirmationToggle = false;
    $scope.error = false;
    $scope.textMessageToggle = false;
    $scope.phoneCallActiveToggle = false;

    // --- Data Models for Inputs and Display ---

    // Current time for the clock widget
    $scope.time = { hours: '00', minutes: '00', date: '' };

    // Input model for the phone dialer
    $scope.call_phone_number = "";

    // Input model for adding a new contact
    $scope.newContact = { first_name: '', last_name: '', phone_number: ''};

    // Input model for sending a new message within an existing conversation
    $scope.newMessage = { text: ''};

    // Input model for starting a new conversation (number and text)
    $scope.newConversation = { number: '', text: '' };

    // Holds the currently selected contact for the text message view
    $scope.activeContact = {};

    // For call status display
    $scope.callingName = ''; // Name/Number of the person being called
    $scope.callStatus = "outgoing"; // Status of the call (e.g., "outgoing", "incoming")

    // Error message display
    $scope.errorMessage = "There Has Been An Error"; // Default error message
    
    // For Twitter notifications toggle in settings
    $scope.isTwitterNotificationsActive = false;

    // --- Core Application Functions ---

    // Updates the digital clock widget every second
    const updateTime = function() {
        const now = new Date();
        $scope.time.hours = now.getHours().toString().padStart(2, '0');
        $scope.time.minutes = now.getMinutes().toString().padStart(2, '0');
        $scope.time.date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
        $timeout(updateTime, 1000); // Schedule the next update
    };
    updateTime(); // Call immediately to display current time

    // Handles scrolling for expandable headers (One UI feature)
    $scope.handleScroll = function(appIdentifier, scrollTop) {
        // Determine if the header should be collapsed based on scroll position
        const collapsedState = scrollTop > 10; // Collapses after 10px scroll
        // Update the header collapsed state only if it has changed
        if ($scope[appIdentifier + 'HeaderCollapsed'] !== collapsedState) {
            $scope[appIdentifier + 'HeaderCollapsed'] = collapsedState;
        }
    };

    // Toggles Dark Mode on/off
    $scope.toggleDarkMode = function() {
        // The ng-model `darkMode` is already updated by the checkbox.
        // No additional logic needed here unless there are other specific actions tied to the toggle.
        // This function is mainly for demonstration and can be expanded for persistence or other effects.
        $scope.toggleView('error', `Dark mode ${$scope.darkMode ? 'enabled' : 'disabled'}!`);
    };

    // Changes the active launcher page when pagination dots are clicked
    $scope.changePage = function(index) {
        $scope.currentPage = index;
    };

    // Implements the "Home" button functionality (Android Navigation Bar)
    $scope.goHome = function() {
        // Iterate through all scope properties
        for (const key in $scope) {
            // If the property name ends with 'Toggle', set its value to false to close the app
            if (key.endsWith('Toggle')) {
                $scope[key] = false;
            }
        }
        // Reset the current view to null, indicating the home screen is active
        $scope.currentView = null;
    };
    
    // Implements the "Back" button functionality (Android Navigation Bar)
    $scope.goBack = function() {
        // If there's an active application view
        if ($scope.currentView) {
            // Toggle that view off, which will also set currentView to null via toggleView function
            $scope.toggleView($scope.currentView);
        }
    };

    // Universal function to open/close different application views
    $scope.toggleView = function(val, data) {
        const toggleName = val + 'Toggle'; // Construct the toggle flag name (e.g., 'contactsToggle')

        // Determine if the action is to close an already open view
        if ($scope[toggleName]) { 
            $scope.currentView = null; // Set current view to null if we are closing it
        } else { // If opening a new view
            $scope.goHome(); // First, close all other open views (return to home state)
            $scope.currentView = val; // Set the newly opened view as the current view
        }

        // Perform the actual toggle for the specific view
        $scope[toggleName] = !$scope[toggleName];

        // Handle specific data or side effects for certain views
        switch (val) {
            case "calling":
                $scope.callingName = data; // Set the name/number for the call screen
                break;
            case "textMessage":
                $scope.activeContact = data; // Set the active contact for the message conversation
                break;
            case "serviceMessage":
                $scope.serviceName = data; // Set the service name for service requests
                break;
            case "error":
                // If an error message is provided, display it, then hide after a timeout
                if (data) $scope.errorMessage = data;
                $timeout(() => { 
                    $scope.error = false; 
                    $scope.errorMessage = "There Has Been An Error"; // Reset to default
                }, 3000);
                break;
        }
    };

    // --- Phone Dialer Functions ---

    // Simulated audio for dialer (requires a sound file path)
    var audio = new Audio(''); // Example: new Audio('path/to/dial_tone.mp3');

    // Adds a digit to the dialer input field
    $scope.addDialer = function(val) {
        // Limit phone number length to 10 digits
        if ($scope.call_phone_number.length >= 10) {
            return;
        }
        // Play dial tone (uncomment when audio file is available)
        // audio.play(); 
        $scope.call_phone_number += val;
    };

    // --- Contact Management Functions ---

    // Handles submission of a new contact
    $scope.submitContact = function() {
        // Validate required fields
        if (!$scope.newContact.first_name || !$scope.newContact.phone_number) {
            $scope.toggleView('error', 'First name and Phone number are required!');
            return;
        }

        // Add the new contact to the contacts list
        $scope.contacts.push({
            id: new Date().getTime(), // Generate a unique ID for the new contact
            first_name: $scope.newContact.first_name,
            last_name: $scope.newContact.last_name,
            phone_number: $scope.newContact.phone_number,
            recent_message: '' // New contacts typically don't have a recent message
        });

        // Clear the input fields after submission
        $scope.newContact = { first_name: '', last_name: '', phone_number: ''};

        // Close the add contact view and return to the contacts list
        $scope.goBack(); // This re-activates the contacts view

        // Optional: Show a "Contact added" success message
        $scope.toggleView('error', 'Contact Added Successfully!');
    };

    // Temporary variable to hold the contact to be deleted during confirmation
    var contactToDelete = null;

    // Prepares for contact deletion by showing the confirmation dialog
    $scope.prepareToDelete = function(contact) {
        contactToDelete = contact; // Store the contact object
        $scope.toggleView('confirmation'); // Open the confirmation dialog
    };

    // Confirms and performs the deletion of the selected contact
    $scope.confirmDelete = function() {
        if (contactToDelete) {
            // Find the index of the contact to delete in the array
            const index = $scope.contacts.findIndex(c => c.id === contactToDelete.id);
            if (index > -1) {
                $scope.contacts.splice(index, 1); // Remove the contact from the array
            }
            contactToDelete = null; // Clear the temporary variable
        }
        // Close the confirmation dialog
        $scope.confirmationToggle = false; 
        // Ensure the contacts view remains open and active
        $scope.currentView = 'contacts'; 
        $scope.contactsToggle = true;
        // Optional: Show a "Contact deleted" success message
        $scope.toggleView('error', 'Contact Deleted!');
    };

    // --- Message Functions ---

    // Sends a message within an existing conversation
    $scope.sendMessage = function() {
        if (!$scope.newMessage.text) return; // Don't send empty messages

        // Add the new message to the messages list (mock data)
        $scope.messages.push({
            id: new Date().getTime(), // Unique ID for the message
            message: $scope.newMessage.text,
            creator: $scope.myNumber, // Assume this message is sent by the current user
            timestamp: new Date().getTime()
        });

        $scope.newMessage.text = ''; // Clear the input field

        // Optional: Implement scroll to bottom of conversation if needed
    };

    // Sends a message to a new conversation (or an existing one via number input)
    $scope.sendNewMessage = function() {
        if (!$scope.newConversation.text || !$scope.newConversation.number) {
            $scope.toggleView('error', 'Number and message text are required!');
            return;
        }
        console.log(`Sending new message: "${$scope.newConversation.text}" to ${$scope.newConversation.number}`);
        
        // In a real app, this would involve sending the message via a backend service.
        // For this mock, we just log and close the view.

        // Clear the input fields
        $scope.newConversation = { number: '', text: '' };
        
        // Close the new message view
        $scope.goBack(); 

        $scope.toggleView('error', 'Message Sent!');
    };

    // --- Settings Functions ---

    // Saves the current phone settings
    $scope.saveSettings = function() {
        // Apply phone size changes based on selected radio button
        $scope.lg = ($scope.screenSize.name === 'large');
        $scope.med = ($scope.screenSize.name === 'medium');
        $scope.sm = ($scope.screenSize.name === 'small');
        $scope.xl = ($scope.screenSize.name === 'extra-large'); // Added for completeness, though not in UI.

        // In a real application, you would save `isTwitterNotificationsActive`
        // and `screenSize.name` to persistent storage or send to a backend.
        console.log("Settings saved:");
        console.log("  Dark Mode:", $scope.darkMode);
        console.log("  Twitter Notifications:", $scope.isTwitterNotificationsActive);
        console.log("  Phone Size:", $scope.screenSize.name);

        // Provide feedback to the user that settings have been saved
        $scope.toggleView('error', 'Settings Saved!');
    };

    // --- Mock Data ---

    // User's own phone number (for distinguishing sent/received messages)
    $scope.myNumber = "2093533313"; 

    // Mock Contact List
    $scope.contacts = [
        { id: 100, first_name: "Peter", last_name: "Bishop", phone_number: "209-342-2054", recent_message: "Sup dood this is a longer string because this needs to be tested as well as a small string to make sure nothing looks fun ok" },
        { id: 101, first_name: "Maya", last_name: "Hansen", phone_number: "209-342-2040", recent_message: "Hey there, how are you doing today? Just checking in." },
        { id: 102, first_name: "John", last_name: "Dough", phone_number: "139-342-2040", recent_message: "Are you available for a quick chat later this afternoon?" },
        { id: 103, first_name: "Bob", last_name: "Loblaw", phone_number: "999-342-2040", recent_message: "Check out my new law blog, it's full of legal insights." },
        { id: 104, first_name: "Walter", last_name: "White", phone_number: "555-123-4567", recent_message: "I am the one who knocks." },
        { id: 105, first_name: "Jesse", last_name: "Pinkman", phone_number: "555-987-6543", recent_message: "Yeah, science, Mr. White! Breaking Bad is awesome." },
        { id: 106, first_name: "Unknown Number", last_name: "", phone_number: "111-222-3333", recent_message: "Who is this? Please identify yourself." },
    ];

    // Mock Message Conversation for activeContact
    $scope.messages = [
        { id: 1, message: "Sup dood this is a longer string because this needs to be tested", creator: "2093533313", timestamp: "13383838383" },
        { id: 2, message: "Sup dood", creator: "2093533312", timestamp: "13383855383" },
        { id: 3, message: "Not much, just coding a cool phone UI.", creator: "2093533313", timestamp: "13383838383" },
        { id: 4, message: "Cool. I found a bug in the matrix, want to fix it?", creator: "2093533312", timestamp: "13383855383" },
        { id: 5, message: "Maybe later! This UI is taking up all my time.", creator: "2093533313", timestamp: "13383855383" }
    ];
});