import 'package:flutter/material.dart';

class ShowRatingWidget extends StatelessWidget {
  final List<Map<String, dynamic>> reviews;

  const ShowRatingWidget({Key? key, required this.reviews}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Bewertungen anderer",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 16),
          if (reviews.isEmpty)
            Padding(
              padding: const EdgeInsets.only(left: 8.0, top: 8.0),
              child: const Text(
                "Noch keine Bewertungen.",
                style: TextStyle(fontSize: 16, color: Colors.white70),
              ),
            ),
          ...reviews.map((review) {
            final int rating = review['rating'] ?? 0;
            String userName = 'Unbekannt'; 

            if (review.containsKey('createdBy')) {
              var createdBy = review['createdBy'];
              userName = createdBy ?? 'Unbekannt'; 
            }

            return Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Card(
                color: const Color.fromARGB(255, 33, 33, 33),
                margin: EdgeInsets.zero,
                child: Container(
                  width: 450,
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(userName, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                            Row(
                              children: List.generate(5, (index) {
                                return Icon(
                                  index < rating ? Icons.star : Icons.star_border,
                                  color: Colors.white,
                                  size: 23,
                                );
                              }),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16), 
                        Text(review['body'] ?? 'No review text available.', style: const TextStyle(fontSize: 16, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
