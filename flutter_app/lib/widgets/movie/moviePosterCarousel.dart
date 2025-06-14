import 'dart:async'; // Für Timer
import 'package:flutter/material.dart';
import 'package:flutter_app/screen/moviepage/moviepage_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:math';
import 'package:flutter_app/services/auth_service.dart'; 

class MoviePosterCarousel extends StatefulWidget {
  final AuthService authService;

  const MoviePosterCarousel({Key? key, required this.authService}) : super(key: key);

  @override
  State<MoviePosterCarousel> createState() => _MoviePosterCarouselState();
}

class _MoviePosterCarouselState extends State<MoviePosterCarousel> {
  List<Map<String, dynamic>> movies = [];
  bool isLoading = true;
  late Timer _timer;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    fetchMovies();

    _timer = Timer.periodic(const Duration(seconds: 15), (Timer timer) {
      setState(() {
        _currentIndex = (_currentIndex + 1) % movies.length;
      });
    });
  }

  Future<void> fetchMovies() async {
    try {
      final response = await http.get(
        Uri.parse('https://cinecritique.mi.hdm-stuttgart.de/api/movies'),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));

        List<Map<String, dynamic>> loadedMovies = data.map((movie) {
          return {
            'poster': movie['backdrops']?.isNotEmpty == true ? movie['backdrops'][0] : '',
            'imdbId': movie['imdbId'], 
          };
        }).toList();

        loadedMovies.shuffle(Random());

        setState(() {
          movies = loadedMovies;
          isLoading = false;
        });
      } else {
        print('Fehler: ${response.statusCode}');
        setState(() {
          isLoading = false;
        });
      }
    } catch (e) {
      print('Fehler beim Abrufen der Filme: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isMobile = MediaQuery.of(context).size.width < 600;
    final double containerWidth = isMobile ? MediaQuery.of(context).size.width * 0.9 : 800;
    final double containerHeight = isMobile ? containerWidth / 2 : 400;

    return isLoading
        ? const Center(child: CircularProgressIndicator())
        : Center(
            child: Container(
              height: containerHeight,
              width: containerWidth,
              child: AnimatedSwitcher(
                duration: const Duration(seconds: 1),
                child: MouseRegion(
                  cursor: SystemMouseCursors.click, 
                  child: GestureDetector(
                    onTap: () {
                      final imdbId = movies[_currentIndex]['imdbId'];
                      if (imdbId != null) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MoviePage(
                              imdbId: imdbId,
                              authService: widget.authService, 
                            ),
                          ),
                        );
                      }
                    },
                    child: ClipRRect(
                      key: ValueKey<int>(_currentIndex), 
                      borderRadius: BorderRadius.circular(18.0),
                      child: Image.network(
                        movies[_currentIndex]['poster'] ?? '',
                        fit: BoxFit.cover,
                        width: containerWidth,
                        height: containerHeight,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
  }
}
