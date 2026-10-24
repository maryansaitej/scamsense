// Answer keys stay on the server. IDs make saved responses easy to explain.
const question = (id, category, prompt, labels, correct, explanation) => ({
  id, category, prompt, choices: labels.map((label, i) => ({ id: String(i), label })), correct: String(correct), explanation
});
export const categories = { email: 'Email phishing', sms: 'SMS scams', support: 'Fake support' };
export const lessons = [
  { id: 'email', title: 'An urgent message is a reason to pause.', tactic: 'Fear & authority', text: 'A sender may pretend to be a trusted company and threaten account closure. A logo, display name, or polished writing does not prove identity.', action: 'Open the service yourself using your usual app or saved address. Check for the same alert there. Report suspicious messages through a trusted channel.' },
  { id: 'sms', title: 'A small payment can hide a bigger request.', tactic: 'Urgency & convenience', text: 'Unexpected delivery texts can lead to requests for card details. The timing of a real delivery does not authenticate a text.', action: 'Check your order using the retailer’s app or the courier details on your original order. Avoid the message link; block or report suspicious senders.' },
  { id: 'support', title: 'You can end a conversation and verify it.', tactic: 'Authority & pressure', text: 'An unsolicited support agent may request a one-time code or remote control of your device. Knowing your name does not make them trustworthy.', action: 'Do not share a sign-in code or grant unsolicited access. End the contact and reach support through the service’s independently opened app or website.' }
];
export const framework = [
  { title: 'Pause', text: 'Slow down when a request creates urgency, fear, or excitement.' },
  { title: 'Inspect', text: 'Examine the sender, destination, request, and context.' },
  { title: 'Verify', text: 'Check through an independently obtained contact method.' },
  { title: 'Respond', text: 'Report suspicious contact and take recovery steps if needed.' }
];
export const assessments = {
  pre: [
    question('p1', 'email', 'An unexpected CloudNest email says your account closes in 20 minutes. It asks you to sign in through its link. What is the best first action?', ['Use the link before time runs out.', 'Open CloudNest using your usual saved address and check the alert.', 'Reply with your password to prove ownership.'], 1, 'Urgency is a pressure tactic. Check through a route you already trust instead of the supplied link.'),
    question('p2', 'email', 'You requested a library receipt. A message arrives with the expected details and no request to sign in or pay. What is reasonable?', ['Treat every email as a scam.', 'Send your password to confirm receipt.', 'Read it; independently check with the library if anything seems wrong.'], 2, 'Expected context supports a legitimate explanation. Stay alert without treating every ordinary message as malicious.'),
    question('p3', 'sms', 'A text says a parcel needs a small redelivery fee. You were expecting a parcel. What should you do?', ['Check the order through the retailer’s app.', 'Pay because the fee is small.', 'Forward the payment link to a friend to try.'], 0, 'A real delivery does not authenticate an unexpected text. Verify using your original order information.'),
    question('p4', 'sms', 'A suspicious text uses perfect spelling and your first name. Does that prove it is genuine?', ['Yes, scammers cannot know my name.', 'Yes, scams always have spelling mistakes.', 'No; inspect the request and verify independently.'], 2, 'Scams can be personalised and well written. Neither grammar nor a name proves the sender’s identity.'),
    question('p5', 'support', 'An unsolicited support agent asks for the code you just received to “protect your account.” What should you do?', ['Share it if they sound professional.', 'Refuse, end the conversation, and contact official support independently.', 'Share half the code.'], 1, 'A sign-in code may give someone access to your account. Do not disclose it to an unsolicited contact.'),
    question('p6', 'support', 'You opened a help ticket inside an app. In that same app, support asks which version you use, without requesting secrets or access. What is reasonable?', ['Provide the app version while staying alert to sensitive requests.', 'Share your password too.', 'Assume every support interaction is fraudulent.'], 0, 'An independently initiated support conversation asking for non-sensitive information is different from an unsolicited request for secrets.')
  ],
  post: [
    question('f1', 'email', 'A StreamHarbor email threatens to delete your photos today unless you verify your account through a link. What is safest?', ['Click because losing photos would be serious.', 'Reply with your sign-in code.', 'Open StreamHarbor independently and check account notices.'], 2, 'Verify a threatening message in the service itself. Emotional pressure is not evidence that a request is legitimate.'),
    question('f2', 'email', 'An expected museum booking confirmation lists your correct visit time and requires no action. How should you respond?', ['Treat it as likely routine; use the independently opened booking site if uncertain.', 'Send payment details in reply.', 'Delete all booking emails as scams.'], 0, 'Expected, low-risk messages can be legitimate. Independently check uncertainties without sharing sensitive information.'),
    question('f3', 'sms', 'A text claims your shopping order is on hold and asks for a small address-correction payment. What should you do?', ['Pay quickly to avoid delay.', 'Open the store’s app and check the order there.', 'Trust it if the link contains the store name somewhere.'], 1, 'Check the order through a known channel. A brand name inside a link and a small fee are not proof of legitimacy.'),
    question('f4', 'sms', 'You receive a suspicious reward text with a company logo and no spelling mistakes. What matters most?', ['Whether the logo looks sharp.', 'Whether it sounds friendly.', 'Whether the request can be verified through an independent trusted channel.'], 2, 'Visual polish and friendly language can be copied. Verify the actual request independently.'),
    question('f5', 'support', 'A pop-up agent claims your device is infected and asks you to enable remote control. What should you do?', ['Close the interaction and independently contact trusted support if needed.', 'Enable control so they can prove the infection.', 'Give them a sign-in code instead.'], 0, 'Do not grant access to an unsolicited contact. If access was already granted, disconnect it and seek trusted help.'),
    question('f6', 'support', 'You contacted a service through its usual app. Support asks for the error message, with personal details removed. What is reasonable?', ['Give your password along with the error.', 'Share the non-sensitive error details in that trusted channel.', 'Assume asking any question proves a scam.'], 1, 'Support can legitimately request non-sensitive diagnostic information. Keep secrets private even in a genuine support conversation.')
  ]
};
export const scenarios = [
  { id: 'email', kind: 'Inbox', title: 'The account closure email', subtitle: 'A familiar logo. An unfamiliar request.', sender: 'CloudNest Account Team', address: 'notice@cloudnest-alert.example', subject: 'Action required: your storage will close today', message: 'Your CloudNest storage is scheduled for closure in 20 minutes. Verify now to keep your photos and documents. Our team cannot reverse this action after the deadline.', link: 'https://cloudnest-verify.example/restore', steps: [
    question('e1', 'email', 'What would you do first?', ['Use “Verify now” to keep my files.', 'Pause and inspect the sender and destination.', 'Reply with my account password.'], 1, 'The threat and short deadline are pressure tactics. Following this request could expose your sign-in details. Inspect the sender and destination, then verify independently. If you shared a password, change it through the real service and review active sessions.'),
    question('e2', 'email', 'How would you check whether the warning is real?', ['Use the phone number included in the email.', 'Ask the sender if they are genuine.', 'Open the service through my saved address, check notices, and report the suspicious email.'], 2, 'Use a contact route independent of the message. If you already entered a password, change it through the real service, review active sessions, and enable multifactor authentication.')
  ] },
  { id: 'sms', kind: 'Messages', title: 'The missed delivery text', subtitle: 'A small fee. A reason to stop.', sender: 'ParcelWay', address: 'Unknown sender', subject: 'Your parcel is waiting', message: 'Delivery unsuccessful. Confirm your address and pay a small redelivery fee within 30 minutes to prevent return to sender.', link: 'https://parcelway-redelivery.example/pay', steps: [
    question('s1', 'sms', 'You are expecting a package. What would you do?', ['Pay the small fee through the message.', 'Check my original order in the retailer’s app.', 'Forward the link so someone else can pay.'], 1, 'A matching delivery does not prove this sender is genuine. Paying on an unverified page could expose payment details; this exercise never opens such a page.'),
    question('s2', 'sms', 'The retailer confirms that no payment is due. What next?', ['Report or block the text and delete it.', 'Pay anyway in case the retailer is wrong.', 'Reply with my home address.'], 0, 'Use the messaging app’s reporting tools where available. If card details were already shared, contact your card provider through a known channel promptly.')
  ] },
  { id: 'support', kind: 'Support chat', title: 'The helpful stranger', subtitle: 'Confidence is not a credential.', sender: 'Alex · BrightDesk support', address: 'Unsolicited chat', subject: 'Security assistance', message: 'We detected suspicious activity. I am here to protect you. Please tell me the six-digit sign-in code you just received so I can cancel the attacker’s login.', link: null, steps: [
    question('t1', 'support', 'How would you respond to the request?', ['Share the code so the agent can act quickly.', 'Ask for a logo as proof.', 'Refuse to share the code and end the chat.'], 2, 'A one-time code can authorise a sign-in. An unsolicited agent requesting it is a warning sign. No real code is collected here.'),
    question('t2', 'support', 'The agent insists and offers to remotely “secure” your device. What next?', ['Allow remote access while watching them.', 'Contact support independently; refuse unsolicited remote access.', 'Send a screenshot of my sign-in code.'], 1, 'Use the real service’s support channel. If access was already granted, disconnect the remote session and get trusted help; review account sessions and change exposed credentials.')
  ] }
];
export function publicQuestion({ correct, explanation, ...rest }) { return rest; }
export function publicContent() {
  return { categories, lessons, framework, modules, revisions: Object.fromEntries(Object.entries(revisions).map(([id, q]) => [id, publicQuestion(q)])),
    assessments: Object.fromEntries(Object.entries(assessments).map(([phase, list]) => [phase, list.map(publicQuestion)])),
    scenarios: scenarios.map(s => ({ ...s, steps: s.steps.map(publicQuestion) })) };
}

// Each module teaches the routine with one worked example, then uses a different
// scenario for practice. These explanations are intentionally visible teaching content.
export const modules = [
  { id: 'email', objective: 'Verify an account warning without using its link.', example: '“PhotoBox: your storage expires today. Sign in at photobox-renew.example to keep your pictures.”', steps: [
    'The deadline and threat of losing photos create pressure. You do not have to act from this message.',
    'The sender calls itself PhotoBox, but the destination is photobox-renew.example. A display name or brand word inside a domain does not prove ownership.',
    'Open PhotoBox through your usual app or saved address and check your account notices there.',
    'If the warning is false, report the email. If you shared a password, change it through the real service and review active sessions.'
  ], takeaway: 'A believable warning still needs an independent check.' },
  { id: 'sms', objective: 'Check a payment request using your original order.', example: '“QuickRoute: address incomplete. Pay a small correction fee at quickroute-update.example within 15 minutes.”', steps: [
    'A small fee and a short deadline make a quick payment feel convenient. Stop before paying.',
    'An unexpected payment link is the important clue. Expecting a real delivery does not authenticate this text.',
    'Open the store’s app and use the delivery information in your original order. Do not use contact details supplied by the text.',
    'If no fee is due, report or block the message. If payment details were shared, contact the card provider using a known channel.'
  ], takeaway: 'A real parcel does not make an unexpected payment link real.' },
  { id: 'support', objective: 'Keep sign-in codes and device access out of unsolicited chats.', example: '“NovaHelp support: someone is signing into your account. Send us the code you just received so we can stop them.”', steps: [
    'The agent combines fear with a promise to help. End the urgency before making a decision.',
    'This unsolicited contact asks for a sign-in code. That code could give the agent account access; a logo or a familiar name is not proof.',
    'Close the chat and reach support through the service’s independently opened app or website.',
    'Do not share the code or grant remote control. If access was already given, disconnect it and seek trusted help to review the account and device.'
  ], takeaway: 'Real support does not need you to trust an unsolicited request for secrets.' }
];
export const revisions = {
  email: question('r-email', 'email', 'A StudyCloud message says a refund is waiting and asks you to sign in through its button. What is the safest way to check?', ['Open StudyCloud through my usual saved address and check billing there.', 'Use the button because receiving money is low risk.', 'Reply with my password to identify my account.'], 0, 'Rewards can create pressure too. Independently open the service to verify the request; do not use the supplied sign-in route.'),
  sms: question('r-sms', 'sms', 'A text says a delivery address needs updating. Your order page, opened through the shop’s app, shows no problem. What next?', ['Send my address in reply just in case.', 'Trust the order page and report or block the unexpected text.', 'Pay the text’s fee to be safe.'], 1, 'The independently opened order page is the better verification route. Do not supply payment or personal details to the unverified sender.'),
  support: question('r-support', 'support', 'You opened the official app yourself and started a support ticket. The agent asks for the app version and an error message with personal details removed. What is reasonable?', ['Send my sign-in code too.', 'Assume all support requests are scams.', 'Share the non-sensitive diagnostic details in this trusted channel.'], 2, 'Context matters. Independently initiated support can legitimately request non-sensitive information. Continue protecting passwords, codes and access.')
};
